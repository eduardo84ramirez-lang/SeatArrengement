import { Student, SeatingLayoutStrategy, FixtureItem } from '../types';

export interface DeskPosition {
  x: number;
  y: number;
  rotation: number;
  row: number;
  col: number;
  isFrontRow: boolean;
  distanceFromBoard: number;
}

export function generateDeskSlots(
  strategy: SeatingLayoutStrategy,
  count: number,
  canvasWidth: number,
  canvasHeight: number,
  fixtures?: Record<string, FixtureItem>
): DeskPosition[] {
  const slots: DeskPosition[] = [];
  const deskWidth = 84;
  const deskHeight = 52;
  const marginX = 40;
  const topOffset = 110; // Below blackboard/teacher desk
  const usableWidth = Math.max(500, canvasWidth - marginX * 2);

  if (strategy === 'rows' || strategy === 'balanced_mentor' || strategy === 'differentiated') {
    // 4 to 6 columns based on student count
    const cols = count <= 16 ? 4 : count <= 25 ? 5 : 6;
    const colSpacing = Math.floor((usableWidth - cols * deskWidth) / (cols + 1));
    const rowSpacing = 28;

    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = marginX + colSpacing + col * (deskWidth + colSpacing);
      const y = topOffset + row * (deskHeight + rowSpacing);

      slots.push({
        x,
        y,
        rotation: 0,
        row,
        col,
        isFrontRow: row === 0 || row === 1,
        distanceFromBoard: y,
      });
    }
  } else if (strategy === 'pods') {
    // 4 desks per pod clustered around shared table space
    const numPods = Math.ceil(count / 4);
    const podsPerRow = numPods <= 4 ? 2 : 3;
    const podColWidth = Math.floor(usableWidth / podsPerRow);
    const podRowHeight = 170;

    for (let p = 0; p < numPods; p++) {
      const pRow = Math.floor(p / podsPerRow);
      const pCol = p % podsPerRow;
      const centerX = marginX + pCol * podColWidth + Math.floor(podColWidth / 2);
      const centerY = topOffset + 30 + pRow * podRowHeight + 50;

      // 4 desks facing each other
      const offsets = [
        { dx: -deskWidth / 2 - 4, dy: -deskHeight / 2 - 4, rot: 0 },
        { dx: deskWidth / 2 + 4, dy: -deskHeight / 2 - 4, rot: 0 },
        { dx: -deskWidth / 2 - 4, dy: deskHeight / 2 + 4, rot: 180 },
        { dx: deskWidth / 2 + 4, dy: deskHeight / 2 + 4, rot: 180 },
      ];

      for (let d = 0; d < 4; d++) {
        if (slots.length >= count) break;
        const off = offsets[d];
        slots.push({
          x: Math.round(centerX + off.dx - deskWidth / 2),
          y: Math.round(centerY + off.dy - deskHeight / 2),
          rotation: off.rot,
          row: pRow * 2 + (d >= 2 ? 1 : 0),
          col: pCol * 2 + (d % 2),
          isFrontRow: pRow === 0,
          distanceFromBoard: centerY,
        });
      }
    }
  } else if (strategy === 'u_shape') {
    // Horseshoe layout around perimeter
    const leftX = marginX + 30;
    const rightX = canvasWidth - marginX - deskWidth - 30;
    const bottomY = Math.min(canvasHeight - 90, topOffset + 380);
    const spacingY = 64;

    const sideDesks = Math.max(3, Math.floor((count - 4) / 2));
    let placed = 0;

    // Left Wing (facing inward/right)
    for (let i = 0; i < sideDesks && placed < count; i++) {
      slots.push({
        x: leftX,
        y: topOffset + i * spacingY,
        rotation: 90,
        row: i,
        col: 0,
        isFrontRow: i <= 1,
        distanceFromBoard: topOffset + i * spacingY,
      });
      placed++;
    }

    // Right Wing (facing inward/left)
    for (let i = 0; i < sideDesks && placed < count; i++) {
      slots.push({
        x: rightX,
        y: topOffset + i * spacingY,
        rotation: 270,
        row: i,
        col: 4,
        isFrontRow: i <= 1,
        distanceFromBoard: topOffset + i * spacingY,
      });
      placed++;
    }

    // Bottom Row
    const bottomCount = count - placed;
    if (bottomCount > 0) {
      const bottomSpacing = Math.floor((rightX - leftX - deskWidth) / (bottomCount + 1));
      for (let i = 0; i < bottomCount && placed < count; i++) {
        slots.push({
          x: leftX + deskWidth + (i + 1) * bottomSpacing - deskWidth / 2,
          y: bottomY,
          rotation: 0,
          row: sideDesks + 1,
          col: i + 1,
          isFrontRow: false,
          distanceFromBoard: bottomY,
        });
        placed++;
      }
    }
  } else {
    // Default Grid
    return generateDeskSlots('rows', count, canvasWidth, canvasHeight, fixtures);
  }

  return slots;
}

export function autoArrangeStudents(
  students: Student[],
  strategy: SeatingLayoutStrategy,
  canvasWidth: number,
  canvasHeight: number,
  fixtures?: Record<string, FixtureItem>,
  options?: {
    separateConflicts?: boolean;
    frontRowNeeds?: boolean;
    pairMentors?: boolean;
  }
): Student[] {
  if (students.length === 0) return [];

  const separateConflicts = options?.separateConflicts !== false;
  const frontRowNeeds = options?.frontRowNeeds !== false;
  const pairMentors = options?.pairMentors !== false;

  const count = students.length;
  const slots = generateDeskSlots(strategy, count, canvasWidth, canvasHeight, fixtures);

  // Copy students to not mutate directly
  let unplaced = [...students];

  // 1. Identify students with special needs (Front row: vision, hearing, ADHD attention)
  const frontRowStudents: Student[] = [];
  const otherStudents: Student[] = [];

  unplaced.forEach(s => {
    const hasFrontNeed = s.traits.includes('front_row_need') || s.traits.includes('easily_distracted');
    if (hasFrontNeed && frontRowNeeds) {
      frontRowStudents.push(s);
    } else {
      otherStudents.push(s);
    }
  });

  // Sort slots by priority (front row slots first)
  const sortedSlotIndices = slots.map((s, idx) => ({ slot: s, idx }))
    .sort((a, b) => a.slot.distanceFromBoard - b.slot.distanceFromBoard);

  const assignedStudentMap = new Map<number, Student>(); // slot index -> student
  const usedStudentIds = new Set<string>();

  // Helper to test conflict between two students
  const areConflicting = (s1: Student, s2: Student): boolean => {
    if (!separateConflicts) return false;
    const hasChatty1 = s1.traits.includes('chatty');
    const hasChatty2 = s2.traits.includes('chatty');
    const directConflict = s1.conflictStudentIds.includes(s2.id) || s2.conflictStudentIds.includes(s1.id);
    return directConflict || (hasChatty1 && hasChatty2);
  };

  // Helper to test if a slot has adjacent conflicts with already assigned students
  const hasAdjacentConflict = (slotIdx: number, candidate: Student): boolean => {
    const targetSlot = slots[slotIdx];
    for (const [assignedIdx, assignedStudent] of assignedStudentMap.entries()) {
      const assignedSlot = slots[assignedIdx];
      // Check Euclidean distance
      const dist = Math.hypot(targetSlot.x - assignedSlot.x, targetSlot.y - assignedSlot.y);
      if (dist < 120) { // Adjacent or directly near
        if (areConflicting(candidate, assignedStudent)) {
          return true;
        }
      }
    }
    return false;
  };

  // Assign front row special needs students first to closest slots
  for (const s of frontRowStudents) {
    let bestSlotIdx = -1;
    for (const item of sortedSlotIndices) {
      if (!assignedStudentMap.has(item.idx)) {
        if (!hasAdjacentConflict(item.idx, s)) {
          bestSlotIdx = item.idx;
          break;
        }
      }
    }
    // If conflict everywhere, pick first empty
    if (bestSlotIdx === -1) {
      const empty = sortedSlotIndices.find(item => !assignedStudentMap.has(item.idx));
      if (empty) bestSlotIdx = empty.idx;
    }

    if (bestSlotIdx !== -1) {
      assignedStudentMap.set(bestSlotIdx, s);
      usedStudentIds.add(s.id);
    }
  }

  // Next, organize remaining students according to chosen strategy
  const remainingStudents = otherStudents.filter(s => !usedStudentIds.has(s.id));

  if (strategy === 'balanced_mentor' && pairMentors) {
    // Interleave High/Mentor students with Support/Medium students
    const mentors = remainingStudents.filter(s => s.performance === 'high' || s.traits.includes('mentor'));
    const support = remainingStudents.filter(s => s.performance === 'support');
    const mediums = remainingStudents.filter(s => s.performance === 'medium' && !s.traits.includes('mentor'));

    const orderedRemaining: Student[] = [];
    const maxLen = Math.max(mentors.length, support.length, mediums.length);

    for (let i = 0; i < maxLen; i++) {
      if (i < support.length) orderedRemaining.push(support[i]);
      if (i < mentors.length) orderedRemaining.push(mentors[i]);
      if (i < mediums.length) orderedRemaining.push(mediums[i]);
    }

    // Place remaining into empty slots
    for (const s of orderedRemaining) {
      if (usedStudentIds.has(s.id)) continue;
      let bestSlotIdx = -1;
      for (const item of sortedSlotIndices) {
        if (!assignedStudentMap.has(item.idx)) {
          if (!hasAdjacentConflict(item.idx, s)) {
            bestSlotIdx = item.idx;
            break;
          }
        }
      }
      if (bestSlotIdx === -1) {
        const empty = sortedSlotIndices.find(item => !assignedStudentMap.has(item.idx));
        if (empty) bestSlotIdx = empty.idx;
      }
      if (bestSlotIdx !== -1) {
        assignedStudentMap.set(bestSlotIdx, s);
        usedStudentIds.add(s.id);
      }
    }
  } else if (strategy === 'differentiated') {
    // Group similar ability levels together in clusters
    const sortedByAbility = [...remainingStudents].sort((a, b) => {
      const order = { high: 0, medium: 1, support: 2 };
      return order[a.performance] - order[b.performance];
    });

    for (const s of sortedByAbility) {
      if (usedStudentIds.has(s.id)) continue;
      const empty = sortedSlotIndices.find(item => !assignedStudentMap.has(item.idx));
      if (empty) {
        assignedStudentMap.set(empty.idx, s);
        usedStudentIds.add(s.id);
      }
    }
  } else if (strategy === 'random') {
    // Shuffle remaining students
    const shuffled = [...remainingStudents].sort(() => Math.random() - 0.5);
    for (const s of shuffled) {
      if (usedStudentIds.has(s.id)) continue;
      const empty = sortedSlotIndices.find(item => !assignedStudentMap.has(item.idx));
      if (empty) {
        assignedStudentMap.set(empty.idx, s);
        usedStudentIds.add(s.id);
      }
    }
  } else {
    // Standard rows or pods with conflict avoidance
    for (const s of remainingStudents) {
      if (usedStudentIds.has(s.id)) continue;
      let bestSlotIdx = -1;
      for (const item of sortedSlotIndices) {
        if (!assignedStudentMap.has(item.idx)) {
          if (!hasAdjacentConflict(item.idx, s)) {
            bestSlotIdx = item.idx;
            break;
          }
        }
      }
      if (bestSlotIdx === -1) {
        const empty = sortedSlotIndices.find(item => !assignedStudentMap.has(item.idx));
        if (empty) bestSlotIdx = empty.idx;
      }
      if (bestSlotIdx !== -1) {
        assignedStudentMap.set(bestSlotIdx, s);
        usedStudentIds.add(s.id);
      }
    }
  }

  // Return mapped students with updated coordinates
  return students.map(s => {
    // Find which slot was assigned
    for (const [slotIdx, assignedStudent] of assignedStudentMap.entries()) {
      if (assignedStudent.id === s.id) {
        const slot = slots[slotIdx];
        return {
          ...s,
          assigned: true,
          x: slot.x,
          y: slot.y,
          rotation: slot.rotation,
          deskNumber: slotIdx + 1,
        };
      }
    }
    return { ...s, assigned: false };
  });
}

// Compute classroom seating metrics / insights
export function computeClassroomMetrics(students: Student[], fixtures?: Record<string, FixtureItem>) {
  const placed = students.filter(s => s.assigned);
  if (placed.length === 0) {
    return {
      totalStudents: students.length,
      placedCount: 0,
      conflictCount: 0,
      frontRowCompliance: 100,
      balanceScore: 100,
      conflictPairs: [] as { s1: Student; s2: Student; dist: number }[],
    };
  }

  // 1. Detect conflicts among placed students
  const conflictPairs: { s1: Student; s2: Student; dist: number }[] = [];
  for (let i = 0; i < placed.length; i++) {
    for (let j = i + 1; j < placed.length; j++) {
      const s1 = placed[i];
      const s2 = placed[j];
      const dist = Math.hypot(s1.x - s2.x, s1.y - s2.y);
      if (dist < 125) { // Adjacent
        const directConflict = s1.conflictStudentIds.includes(s2.id) || s2.conflictStudentIds.includes(s1.id);
        const chattyConflict = s1.traits.includes('chatty') && s2.traits.includes('chatty');
        if (directConflict || chattyConflict) {
          conflictPairs.push({ s1, s2, dist });
        }
      }
    }
  }

  // 2. Check front row compliance for students with front_row_need
  const needsFront = placed.filter(s => s.traits.includes('front_row_need') || s.traits.includes('easily_distracted'));
  let compliantFront = 0;
  needsFront.forEach(s => {
    if (s.y <= 180) { // Top rows
      compliantFront++;
    }
  });

  const frontRowCompliance = needsFront.length > 0
    ? Math.round((compliantFront / needsFront.length) * 100)
    : 100;

  // 3. Balance score calculation (0 - 100)
  const conflictPenalty = Math.min(60, conflictPairs.length * 15);
  const frontPenalty = (100 - frontRowCompliance) * 0.4;
  const balanceScore = Math.max(10, Math.round(100 - conflictPenalty - frontPenalty));

  return {
    totalStudents: students.length,
    placedCount: placed.length,
    conflictCount: conflictPairs.length,
    frontRowCompliance,
    balanceScore,
    conflictPairs,
  };
}
