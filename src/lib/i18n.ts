export type Language = 'es' | 'en' | 'fr';

export interface Translations {
  appName: string;
  appSubtitle: string;
  classrooms: string;
  newClassroom: string;
  studentsCount: string;
  syncSaved: string;
  syncSaving: string;
  syncOffline: string;
  syncError: string;
  saveCloud: string;
  exportPdf: string;
  exportPng: string;
  loginGoogle: string;
  logout: string;
  
  // Pedagogical Diagnosis in Bar Menu & Modal
  pedagogicalDiagnosis: string;
  pedagogicalDiagnosisDesc: string;
  pedagogicalSummary: string;
  priorityFrontRow: string;
  conflictPairsTitle: string;
  academicBalance: string;
  mentorsPairedTitle: string;
  recommendationsTitle: string;
  closeDiagnosis: string;
  runAutoArrange: string;
  diagnosisStatusOptimal: string;
  diagnosisStatusAttention: string;
  diagnosisStatusCritical: string;

  // Roster Sidebar
  studentRoster: string;
  unassigned: string;
  allAssigned: string;
  searchPlaceholder: string;
  filterAll: string;
  filterUnassigned: string;
  filterFrontRow: string;
  filterSupport: string;
  filterHigh: string;
  filterChatty: string;
  noStudentsFound: string;
  deskAssigned: string;
  placeOnCanvas: string;
  addStudent: string;
  quickPaste: string;
  copyRoster: string;
  importCsv: string;
  scanPaperOcr: string;
  
  // Quick Paste Modal
  quickPasteTitle: string;
  quickPasteDesc: string;
  quickPastePlaceholder: string;
  quickPasteButton: string;
  quickPasteCount: string;
  quickPasteHelp: string;
  clearText: string;
  
  // Student Traits & Badges
  frontRowNeed: string;
  mentor: string;
  chatty: string;
  conflict: string;
  independent: string;
  calmFocus: string;
  easilyDistracted: string;
  peerMentor: string;
  frequentTalker: string;
  avoidAdjacentTo: string;
  notes: string;
  student: string;
  saved: string;
  
  // Performance
  perfHigh: string;
  perfMedium: string;
  perfSupport: string;
  academicPerf: string;
  highPerf: string;
  mediumPerf: string;
  supportPerf: string;
  
  // Canvas & Classroom Controls
  traceMap: string;
  clickToPlace: string;
  clickToPlaceActive: string;
  clickToPlaceDesc: string;
  zoomIn: string;
  zoomOut: string;
  resetZoom: string;
  opacity: string;
  hideMap: string;
  showMap: string;
  uploadMapPhoto: string;
  blackboard: string;
  teacherDesk: string;
  door: string;
  window: string;
  lockers: string;
  bookshelf: string;
  trash: string;
  plant: string;
  frontBoard: string;
  rotate: string;
  unseat: string;
  swapWith: string;
  
  // Insights & Auto Arrange
  insights: string;
  optimal: string;
  harmonyScore: string;
  frontRowNeeds: string;
  noConflicts: string;
  conflictsDetected: string;
  selectedStudent: string;
  edit: string;
  performance: string;
  autoArrange: string;
  rowsLayout: string;
  podsLayout: string;
  uShapeLayout: string;
  mentorLayout: string;
  abilityGroups: string;
  separateConflicts: string;
  pairMentors: string;
  montessoriTipTitle: string;
  montessoriTipDesc: string;
  loadSample: string;
  clearCanvas: string;
  
  // Modals & Forms
  editStudent: string;
  newStudent: string;
  fullName: string;
  gradeScore: string;
  behavioralTraits: string;
  deleteStudent: string;
  cancel: string;
  saveChanges: string;
  
  // Toast notifications
  classroomsLoaded: string;
  studentUnassignedToast: string;
  studentPlacedToast: string;
  studentsSwappedToast: string;
  paperMapLoadedToast: string;
  deskPlacedToast: string;
  autoArrangedToast: string;
  studentDeletedToast: string;
  studentsImportedToast: string;
  rosterCopied: string;
  exportPdfLoading: string;
  exportPdfSuccess: string;
  exportPngLoading: string;
  exportPngSuccess: string;
  cloudSavedSuccess: string;
  allUnassignedToast: string;
  sampleLoadedToast: string;
  loggedOut: string;
}

export const translations: Record<Language, Translations> = {
  es: {
    appName: 'Montessori Seating Master',
    appSubtitle: 'Planificador Pedagógico & Asignación Conductual',
    classrooms: 'Salones',
    newClassroom: '+ Nuevo Salón de Clase...',
    studentsCount: 'estudiantes',
    syncSaved: 'Nube Sincronizada',
    syncSaving: 'Guardando...',
    syncOffline: 'Modo Local',
    syncError: 'Error Nube',
    saveCloud: 'Guardar',
    exportPdf: 'Exportar PDF',
    exportPng: 'Exportar PNG',
    loginGoogle: 'Acceso Montessori',
    logout: 'Cerrar Sesión',
    
    // Pedagogical Diagnosis in Bar Menu & Modal
    pedagogicalDiagnosis: 'Diagnóstico Pedagógico',
    pedagogicalDiagnosisDesc: 'Evaluación integral de convivencia, necesidades sensoriales y balance académico en el aula.',
    pedagogicalSummary: 'Resumen General del Salón',
    priorityFrontRow: 'Atención Prioritaria (1ª Fila)',
    conflictPairsTitle: 'Control de Incompatibilidades y Distracción',
    academicBalance: 'Balance Académico & Tutorías',
    mentorsPairedTitle: 'Tutores Pares Asignados',
    recommendationsTitle: 'Recomendaciones Pedagógicas Montessori',
    closeDiagnosis: 'Cerrar Diagnóstico',
    runAutoArrange: 'Optimizar Ubicaciones Automáticamente',
    diagnosisStatusOptimal: 'Excelente Armonía',
    diagnosisStatusAttention: 'Requiere Ajustes Menores',
    diagnosisStatusCritical: 'Conflictos Detectados',

    // Roster Sidebar
    studentRoster: 'Lista de Estudiantes',
    unassigned: 'sin asignar',
    allAssigned: 'Todos ubicados',
    searchPlaceholder: 'Buscar por nombre o nota...',
    filterAll: 'Todos',
    filterUnassigned: 'Sin Ubicar',
    filterFrontRow: 'Fila Frontal',
    filterSupport: 'Refuerzo',
    filterHigh: 'Alto Rendimiento',
    filterChatty: 'Conversadores',
    noStudentsFound: 'No se encontraron estudiantes.',
    deskAssigned: 'En Mesa',
    placeOnCanvas: 'Ubicar',
    addStudent: 'Crear Estudiante',
    quickPaste: 'Pegar Lista Rápida',
    copyRoster: 'Copiar Lista',
    importCsv: 'Cargar CSV',
    scanPaperOcr: 'Foto Papel OCR',
    
    // Quick Paste Modal
    quickPasteTitle: 'Copiar y Pegar Lista de Estudiantes',
    quickPasteDesc: 'Pega tu lista de estudiantes directamente desde Word, Excel, WhatsApp o bloc de notas.',
    quickPastePlaceholder: 'Camila Morales\nSantiago Gómez, A\nValentina Ríos, 95, Alto\nMateo Fernández\nLuciana Castro',
    quickPasteButton: 'Agregar Estudiantes al Salón',
    quickPasteCount: 'estudiantes detectados',
    quickPasteHelp: 'Formato simple: Solo escribe los nombres (un estudiante por línea).',
    clearText: 'Limpiar',
    
    // Student Traits & Badges
    frontRowNeed: 'Necesita 1ª Fila (Visión/Oído)',
    mentor: 'Tutor Par',
    chatty: 'Conversador Frecuente',
    conflict: 'Conflicto',
    independent: 'Autónomo',
    calmFocus: 'Enfocado',
    easilyDistracted: 'Se Distrae con Facilidad',
    peerMentor: 'Tutor Par / Apoyo Solidario',
    frequentTalker: 'Conversador Frecuente',
    avoidAdjacentTo: 'Evitar sentar al lado de (Incompatibilidad / Conflictos):',
    notes: 'Observaciones Pedagógicas',
    student: 'Estudiante',
    saved: 'Guardado',
    
    // Performance
    perfHigh: 'Alto Rendimiento',
    perfMedium: 'Nivel Medio',
    perfSupport: 'Necesita Refuerzo',
    academicPerf: 'Nivel de Desempeño Académico',
    highPerf: 'Alto / Excelente',
    mediumPerf: 'Básico / Medio',
    supportPerf: 'Requiere Refuerzo',
    
    // Canvas & Classroom Controls
    traceMap: 'Mapa de Papel (Calco)',
    clickToPlace: 'Clic para Ubicar',
    clickToPlaceActive: 'Modo Clic Activo (Haz clic en el plano para colocar)',
    clickToPlaceDesc: 'Haz clic en cualquier punto del aula o foto para colocar un pupitre.',
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
    resetZoom: 'Centrar',
    opacity: 'Opacidad del Plano',
    hideMap: 'Ocultar Calco',
    showMap: 'Mostrar Calco',
    uploadMapPhoto: 'Subir Foto de Plano',
    blackboard: 'Tablero Principal / Pizarra',
    teacherDesk: 'Mesa del Docente',
    door: 'Puerta Principal',
    window: 'Ventana',
    lockers: 'Casilleros',
    bookshelf: 'Estantería de Libros',
    trash: 'Papelera',
    plant: 'Planta',
    frontBoard: 'Frente de la Clase / Tablero',
    rotate: 'Girar 90°',
    unseat: 'Quitar del Plano',
    swapWith: 'Intercambiar Asiento',
    
    // Insights & Auto Arrange
    insights: 'Diagnóstico Pedagógico',
    optimal: 'Óptimo',
    harmonyScore: 'Armonía & Convivencia',
    frontRowNeeds: 'Atención Prioritaria (Fila 1)',
    noConflicts: 'Sin conflictos entre estudiantes adyacentes',
    conflictsDetected: 'parejas conflictivas detectadas',
    selectedStudent: 'Estudiante Seleccionado',
    edit: 'Editar',
    performance: 'Rendimiento',
    autoArrange: 'Disposición Automática',
    rowsLayout: 'Filas',
    podsLayout: 'Grupos/Pods',
    uShapeLayout: 'Forma U',
    mentorLayout: 'Tutor-Par',
    abilityGroups: 'Por Niveles',
    separateConflicts: 'Separar parejas de conflicto',
    pairMentors: 'Emparejar tutores con refuerzo',
    montessoriTipTitle: 'Consejo Montessori',
    montessoriTipDesc: 'La disposición Tutor-Par promueve la cooperación y reduce distracciones en un 38%.',
    loadSample: 'Cargar Ejemplo',
    clearCanvas: 'Limpiar Plano',
    
    // Modals & Forms
    editStudent: 'Editar Perfil del Estudiante',
    newStudent: 'Nuevo Estudiante',
    fullName: 'Nombre Completo',
    gradeScore: 'Nota / Calificación',
    behavioralTraits: 'Rasgos Conductuales & Necesidades de Ubicación',
    deleteStudent: 'Eliminar Estudiante',
    cancel: 'Cancelar',
    saveChanges: 'Guardar Cambios',
    
    // Toast notifications
    classroomsLoaded: 'Se cargaron tus planos de aula.',
    studentUnassignedToast: 'Estudiante retirado del plano al panel de espera',
    studentPlacedToast: 'Estudiante ubicado en el aula',
    studentsSwappedToast: '¡Asientos intercambiados exitosamente!',
    paperMapLoadedToast: 'Mapa de referencia en papel cargado',
    deskPlacedToast: 'Asiento ubicado en el punto seleccionado',
    autoArrangedToast: 'Aula organizada automáticamente',
    studentDeletedToast: 'Estudiante eliminado',
    studentsImportedToast: 'estudiantes importados al salón',
    rosterCopied: '¡Lista de estudiantes copiada al portapapeles!',
    exportPdfLoading: 'Generando documento PDF de alta resolución...',
    exportPdfSuccess: '¡PDF del plano descargado exitosamente!',
    exportPngLoading: 'Capturando imagen limpia del aula...',
    exportPngSuccess: '¡Imagen PNG del plano descargada!',
    cloudSavedSuccess: 'Plano guardado exitosamente en Firebase',
    allUnassignedToast: 'Se retiraron todos los estudiantes del plano',
    sampleLoadedToast: 'Datos de ejemplo cargados',
    loggedOut: 'Sesión cerrada',
  },
  
  en: {
    appName: 'Montessori Seating Master',
    appSubtitle: 'Pedagogical Planner & Behavioral Seating Chart',
    classrooms: 'Classrooms',
    newClassroom: '+ New Classroom...',
    studentsCount: 'students',
    syncSaved: 'Cloud Synced',
    syncSaving: 'Saving...',
    syncOffline: 'Local Mode',
    syncError: 'Cloud Error',
    saveCloud: 'Save',
    exportPdf: 'Export PDF',
    exportPng: 'Export PNG',
    loginGoogle: 'Montessori Login',
    logout: 'Log Out',
    
    // Pedagogical Diagnosis in Bar Menu & Modal
    pedagogicalDiagnosis: 'Pedagogical Diagnosis',
    pedagogicalDiagnosisDesc: 'Comprehensive classroom assessment of harmony, sensory needs, and academic balance.',
    pedagogicalSummary: 'Classroom Overview',
    priorityFrontRow: 'Priority Focus (1st Row)',
    conflictPairsTitle: 'Incompatibility & Distraction Control',
    academicBalance: 'Academic Balance & Tutoring',
    mentorsPairedTitle: 'Assigned Peer Mentors',
    recommendationsTitle: 'Montessori Pedagogical Recommendations',
    closeDiagnosis: 'Close Diagnosis',
    runAutoArrange: 'Auto-Optimize Seating Chart',
    diagnosisStatusOptimal: 'Excellent Harmony',
    diagnosisStatusAttention: 'Minor Adjustments Needed',
    diagnosisStatusCritical: 'Conflicts Detected',

    // Roster Sidebar
    studentRoster: 'Student Roster',
    unassigned: 'unassigned',
    allAssigned: 'All placed',
    searchPlaceholder: 'Search by name or grade...',
    filterAll: 'All',
    filterUnassigned: 'Unplaced',
    filterFrontRow: 'Front Row',
    filterSupport: 'Support',
    filterHigh: 'High Perf.',
    filterChatty: 'Talkative',
    noStudentsFound: 'No students found.',
    deskAssigned: 'Seated',
    placeOnCanvas: 'Place',
    addStudent: 'Add Student',
    quickPaste: 'Quick Paste List',
    copyRoster: 'Copy Roster',
    importCsv: 'Import CSV',
    scanPaperOcr: 'Scan Paper OCR',
    
    // Quick Paste Modal
    quickPasteTitle: 'Copy & Paste Student Roster',
    quickPasteDesc: 'Paste your student list directly from Word, Excel, WhatsApp or plain text.',
    quickPastePlaceholder: 'Emily Watson\nLiam Johnson, A\nSophia Davis, 95, High\nNoah Miller\nOlivia Garcia',
    quickPasteButton: 'Add Students to Classroom',
    quickPasteCount: 'students detected',
    quickPasteHelp: 'Simple format: Just write or paste names (one student per line).',
    clearText: 'Clear',
    
    // Student Traits & Badges
    frontRowNeed: 'Needs Front Row (Vision/Hearing)',
    mentor: 'Peer Mentor',
    chatty: 'Frequent Talker',
    conflict: 'Conflict',
    independent: 'Independent',
    calmFocus: 'Focused',
    easilyDistracted: 'Easily Distracted',
    peerMentor: 'Peer Mentor / Supportive',
    frequentTalker: 'Frequent Talker',
    avoidAdjacentTo: 'Avoid seating next to (Incompatibility / Conflict):',
    notes: 'Pedagogical Observations',
    student: 'Student',
    saved: 'Saved',
    
    // Performance
    perfHigh: 'High Performance',
    perfMedium: 'Average Level',
    perfSupport: 'Needs Support',
    academicPerf: 'Academic Performance Level',
    highPerf: 'High / Excellent',
    mediumPerf: 'Standard / Medium',
    supportPerf: 'Needs Support',
    
    // Canvas & Classroom Controls
    traceMap: 'Paper Map (Overlay)',
    clickToPlace: 'Click to Place',
    clickToPlaceActive: 'Click Mode Active (Click on canvas to place desk)',
    clickToPlaceDesc: 'Click anywhere on the room canvas or photo overlay to place a desk.',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    resetZoom: 'Center',
    opacity: 'Map Opacity',
    hideMap: 'Hide Overlay',
    showMap: 'Show Overlay',
    uploadMapPhoto: 'Upload Map Photo',
    blackboard: 'Whiteboard / Chalkboard',
    teacherDesk: 'Teacher Desk',
    door: 'Main Door',
    window: 'Window',
    lockers: 'Lockers',
    bookshelf: 'Bookshelf',
    trash: 'Trash Bin',
    plant: 'Plant',
    frontBoard: 'Front of Classroom / Board',
    rotate: 'Rotate 90°',
    unseat: 'Remove from Map',
    swapWith: 'Swap Seat',
    
    // Insights & Auto Arrange
    insights: 'Pedagogical Diagnosis',
    optimal: 'Optimal',
    harmonyScore: 'Harmony & Behavior',
    frontRowNeeds: 'Priority Focus (Row 1)',
    noConflicts: 'No adjacent conflict pairs detected',
    conflictsDetected: 'conflict pairs detected',
    selectedStudent: 'Selected Student',
    edit: 'Edit',
    performance: 'Performance',
    autoArrange: 'Auto Arrange',
    rowsLayout: 'Rows',
    podsLayout: 'Pods / Groups',
    uShapeLayout: 'U-Shape',
    mentorLayout: 'Peer-Mentor',
    abilityGroups: 'By Ability',
    separateConflicts: 'Separate conflict pairs',
    pairMentors: 'Pair mentors with support learners',
    montessoriTipTitle: 'Montessori Tip',
    montessoriTipDesc: 'Peer-mentor arrangement promotes collaborative focus and reduces classroom chatter by 38%.',
    loadSample: 'Load Sample',
    clearCanvas: 'Clear Map',
    
    // Modals & Forms
    editStudent: 'Edit Student Profile',
    newStudent: 'New Student',
    fullName: 'Full Name',
    gradeScore: 'Grade / Score',
    behavioralTraits: 'Behavioral Traits & Seating Needs',
    deleteStudent: 'Delete Student',
    cancel: 'Cancel',
    saveChanges: 'Save Changes',
    
    // Toast notifications
    classroomsLoaded: 'Classroom layouts loaded from cloud.',
    studentUnassignedToast: 'Student moved back to waiting roster',
    studentPlacedToast: 'Student placed in classroom',
    studentsSwappedToast: 'Seats swapped successfully!',
    paperMapLoadedToast: 'Paper reference map loaded',
    deskPlacedToast: 'Desk placed at chosen coordinates',
    autoArrangedToast: 'Classroom auto-arranged successfully',
    studentDeletedToast: 'Student removed',
    studentsImportedToast: 'students imported to classroom',
    rosterCopied: 'Student roster copied to clipboard!',
    exportPdfLoading: 'Generating high-resolution printable PDF...',
    exportPdfSuccess: 'Printable PDF downloaded successfully!',
    exportPngLoading: 'Capturing clean classroom image...',
    exportPngSuccess: 'PNG classroom blueprint downloaded!',
    cloudSavedSuccess: 'Classroom saved securely to Firebase',
    allUnassignedToast: 'All students removed from blueprint',
    sampleLoadedToast: 'Sample classroom data loaded',
    loggedOut: 'Logged out successfully',
  },
  
  fr: {
    appName: 'Montessori Seating Master',
    appSubtitle: 'Planificateur Pédagogique & Disposition de Classe',
    classrooms: 'Salles de Classe',
    newClassroom: '+ Nouvelle Classe...',
    studentsCount: 'élèves',
    syncSaved: 'Cloud Synchronisé',
    syncSaving: 'Enregistrement...',
    syncOffline: 'Mode Local',
    syncError: 'Erreur Cloud',
    saveCloud: 'Sauvegarder',
    exportPdf: 'Exporter PDF',
    exportPng: 'Exporter PNG',
    loginGoogle: 'Connexion Montessori',
    logout: 'Déconnexion',
    
    // Pedagogical Diagnosis in Bar Menu & Modal
    pedagogicalDiagnosis: 'Diagnostic Pédagogique',
    pedagogicalDiagnosisDesc: 'Évaluation globale de l’harmonie de classe, des besoins sensoriels et de l’équilibre scolaire.',
    pedagogicalSummary: 'Aperçu Général de la Classe',
    priorityFrontRow: 'Attention Prioritaire (1er Rang)',
    conflictPairsTitle: 'Contrôle des Incompatibilités et Bavardages',
    academicBalance: 'Équilibre Scolaire & Tutorat',
    mentorsPairedTitle: 'Tuteurs Pairs Associés',
    recommendationsTitle: 'Recommandations Pédagogiques Montessori',
    closeDiagnosis: 'Fermer Diagnostic',
    runAutoArrange: 'Optimiser Automatiquement le Plan',
    diagnosisStatusOptimal: 'Excellente Harmonie',
    diagnosisStatusAttention: 'Ajustements Mineurs Conseillés',
    diagnosisStatusCritical: 'Conflits Détectés',

    // Roster Sidebar
    studentRoster: 'Liste des Élèves',
    unassigned: 'non placés',
    allAssigned: 'Tous placés',
    searchPlaceholder: 'Rechercher par nom ou note...',
    filterAll: 'Tous',
    filterUnassigned: 'Non Placés',
    filterFrontRow: 'Premier Rang',
    filterSupport: 'Soutien',
    filterHigh: 'Haut Niveau',
    filterChatty: 'Bavards',
    noStudentsFound: 'Aucun élève trouvé.',
    deskAssigned: 'Placé',
    placeOnCanvas: 'Placer',
    addStudent: 'Ajouter Élève',
    quickPaste: 'Coller la Liste',
    copyRoster: 'Copier la Liste',
    importCsv: 'Importer CSV',
    scanPaperOcr: 'Scanner Papier OCR',
    
    // Quick Paste Modal
    quickPasteTitle: 'Copier & Coller la Liste des Élèves',
    quickPasteDesc: 'Collez votre liste d’élèves depuis Word, Excel, WhatsApp ou bloc-notes.',
    quickPastePlaceholder: 'Camille Dupont\nLucas Martin, A\nLéa Bernard, 95, Haut\nGabriel Thomas\nEmma Petit',
    quickPasteButton: 'Ajouter les Élèves à la Classe',
    quickPasteCount: 'élèves détectés',
    quickPasteHelp: 'Format simple : Écrivez ou collez les noms (un élève par ligne).',
    clearText: 'Effacer',
    
    // Student Traits & Badges
    frontRowNeed: 'Besoins Premier Rang (Vue/Ouïe)',
    mentor: 'Tuteur Pair',
    chatty: 'Bavard Régulier',
    conflict: 'Conflit',
    independent: 'Autonome',
    calmFocus: 'Concentré',
    easilyDistracted: 'Distraction Facile',
    peerMentor: 'Tuteur Pair / Soutien Solidaire',
    frequentTalker: 'Bavard Régulier',
    avoidAdjacentTo: 'Éviter d’asseoir à côté de (Incompatibilité / Conflit) :',
    notes: 'Observations Pédagogiques',
    student: 'Élève',
    saved: 'Enregistré',
    
    // Performance
    perfHigh: 'Haut Niveau',
    perfMedium: 'Niveau Moyen',
    perfSupport: 'Besoin de Soutien',
    academicPerf: 'Niveau de Performance Scolaire',
    highPerf: 'Haut / Excellent',
    mediumPerf: 'Standard / Moyen',
    supportPerf: 'Besoin de Soutien',
    
    // Canvas & Classroom Controls
    traceMap: 'Plan Papier (Calque)',
    clickToPlace: 'Cliquer pour Placer',
    clickToPlaceActive: 'Mode Clic Actif (Cliquez sur le plan pour placer un pupitre)',
    clickToPlaceDesc: 'Cliquez n’importe où sur le plan ou la photo pour poser un bureau.',
    zoomIn: 'Zoomer',
    zoomOut: 'Dézoomer',
    resetZoom: 'Centrer',
    opacity: 'Opacité du Calque',
    hideMap: 'Masquer le Calque',
    showMap: 'Afficher le Calque',
    uploadMapPhoto: 'Téléverser Photo du Plan',
    blackboard: 'Tableau Principal / Craie',
    teacherDesk: 'Bureau Enseignant',
    door: 'Porte Principale',
    window: 'Fenêtre',
    lockers: 'Casiers',
    bookshelf: 'Bibliothèque',
    trash: 'Poubelle',
    plant: 'Plante',
    frontBoard: 'Devant de la Classe / Tableau',
    rotate: 'Pivoter 90°',
    unseat: 'Retirer du Plan',
    swapWith: 'Échanger la Place',
    
    // Insights & Auto Arrange
    insights: 'Diagnostic Pédagogique',
    optimal: 'Optimal',
    harmonyScore: 'Harmonie & Convivialité',
    frontRowNeeds: 'Attention Prioritaire (Rang 1)',
    noConflicts: 'Aucun conflit d’adjacence détecté',
    conflictsDetected: 'paires conflictuelles détectées',
    selectedStudent: 'Élève Sélectionné',
    edit: 'Modifier',
    performance: 'Niveau',
    autoArrange: 'Disposition Automatique',
    rowsLayout: 'Rangées',
    podsLayout: 'Îlots/Groupes',
    uShapeLayout: 'En U',
    mentorLayout: 'Tuteur-Pair',
    abilityGroups: 'Par Niveaux',
    separateConflicts: 'Séparer les paires en conflit',
    pairMentors: 'Associer les tuteurs aux élèves en soutien',
    montessoriTipTitle: 'Conseil Montessori',
    montessoriTipDesc: 'La disposition en binôme Tuteur-Pair favorise l’entraide et réduit les bavardages de 38%.',
    loadSample: 'Charger Exemple',
    clearCanvas: 'Nettoyer le Plan',
    
    // Modals & Forms
    editStudent: 'Modifier la Fiche Élève',
    newStudent: 'Nouvel Élève',
    fullName: 'Nom Complet',
    gradeScore: 'Note / Évaluation',
    behavioralTraits: 'Profil Comportemental & Besoins de Placement',
    deleteStudent: 'Supprimer Élève',
    cancel: 'Annuler',
    saveChanges: 'Enregistrer Modifications',
    
    // Toast notifications
    classroomsLoaded: 'Plans de classe chargés depuis le Cloud.',
    studentUnassignedToast: 'Élève retiré du plan vers la liste d’attente',
    studentPlacedToast: 'Élève placé dans la classe',
    studentsSwappedToast: 'Places échangées avec succès !',
    paperMapLoadedToast: 'Plan de référence papier chargé',
    deskPlacedToast: 'Pupitre placé au point choisi',
    autoArrangedToast: 'Classe organisée automatiquement',
    studentDeletedToast: 'Élève supprimé',
    studentsImportedToast: 'élèves importés dans la classe',
    rosterCopied: 'Liste des élèves copiée dans le presse-papiers !',
    exportPdfLoading: 'Génération du document PDF haute résolution...',
    exportPdfSuccess: 'PDF imprimable téléchargé avec succès !',
    exportPngLoading: 'Capture de l’image de la classe...',
    exportPngSuccess: 'Image PNG de la classe téléchargée !',
    cloudSavedSuccess: 'Classe sauvegardée dans Firebase',
    allUnassignedToast: 'Tous les élèves ont été retirés du plan',
    sampleLoadedToast: 'Données d’exemple chargées',
    loggedOut: 'Déconnecté avec succès',
  },
};

export function getTranslations(lang: Language): Translations {
  return translations[lang] || translations.es;
}
