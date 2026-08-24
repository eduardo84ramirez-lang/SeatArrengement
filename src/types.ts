export type PerformanceLevel = 'high' | 'medium' | 'support';

export type BehaviorTrait = 
  | 'front_row_need'     // Visual / Hearing / High Focus Attention Need
  | 'easily_distracted'  // Needs low-distraction zone
  | 'chatty'             // Talks frequently, keep away from other chatty peers
  | 'mentor'             // Patient, high focus, good peer helper
  | 'independent'        // Self-directed, works well anywhere
  | 'calm_focus';        // Quiet, steady worker

export interface Student {
  id: string;
  name: string;
  grade?: string; // e.g. "A", "B+", "92"
  performance: PerformanceLevel; // 'high' | 'medium' | 'support'
  performanceScore?: number; // 0 - 100
  traits: BehaviorTrait[];
  conflictStudentIds: string[]; // IDs of students this student should not sit adjacent to
  preferredStudentIds?: string[]; // IDs of students that work well together
  notes?: string;
  
  // Placement state on canvas
  assigned: boolean;
  x: number;
  y: number;
  rotation?: number; // 0, 90, 180, 270
  deskNumber?: number;
}

export type FixtureType = 
  | 'teacher_desk'
  | 'blackboard'
  | 'door'
  | 'window'
  | 'lockers'
  | 'bookshelf'
  | 'trash'
  | 'plant'
  | 'closet'
  | 'tv';

export interface FixtureItem {
  id: string;
  type: FixtureType;
  label: string;
  visible: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color?: string;
}

export interface PaperMapConfig {
  imageUrl: string | null;
  opacity: number; // 0.1 to 1.0
  scale: number;
  offsetX: number;
  offsetY: number;
}

export type SeatingLayoutStrategy = 'rows' | 'pods' | 'u_shape' | 'balanced_mentor' | 'differentiated' | 'random';

export interface ClassroomLayout {
  id: string;
  name: string;
  gradeLevel: string;
  updatedAt: string;
  students: Student[];
  fixtures: Record<string, FixtureItem>;
  paperMap: PaperMapConfig;
  canvasWidth: number;
  canvasHeight: number;
  gridSnap: boolean;
  notes?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isMontessoriDomain: boolean;
}
