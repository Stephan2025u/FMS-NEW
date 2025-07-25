export const mockClients = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-03-15",
    occupation: "Software Engineer",
    createdAt: "2024-01-15T10:30:00Z",
    lastTestDate: "2024-07-10T14:20:00Z",
    totalTests: 3,
    latestScore: 18
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 234-5678",
    dateOfBirth: "1992-07-22",
    occupation: "Physical Therapist",
    createdAt: "2024-02-01T09:15:00Z",
    lastTestDate: "2024-07-12T11:45:00Z",
    totalTests: 2,
    latestScore: 16
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mike.davis@email.com",
    phone: "(555) 345-6789",
    dateOfBirth: "1988-11-30",
    occupation: "Personal Trainer",
    createdAt: "2024-03-10T16:00:00Z",
    lastTestDate: "2024-07-08T13:30:00Z",
    totalTests: 5,
    latestScore: 20
  }
];

export const mockTestResults = [
  {
    id: "test-1",
    clientId: "1",
    testDate: "2024-07-10T14:20:00Z",
    scores: {
      deepSquat: { score: 2, pain: false, notes: "Good depth, minor knee valgus" },
      hurdleStep: { score: 3, pain: false, notes: "Perfect form bilaterally" },
      inLineLunge: { score: 2, pain: false, notes: "Slight loss of balance" },
      shoulderMobility: { score: 3, pain: false, notes: "Excellent mobility" },
      activeStraightLeg: { score: 2, pain: false, notes: "Tight hamstrings" },
      trunkStabilityPushup: { score: 3, pain: false, notes: "Strong core stability" },
      rotaryStability: { score: 3, pain: false, notes: "Good control" }
    },
    totalScore: 18,
    assessorNotes: "Overall good movement quality. Focus on hip mobility and balance training."
  },
  {
    id: "test-2",
    clientId: "2",
    testDate: "2024-07-12T11:45:00Z",
    scores: {
      deepSquat: { score: 2, pain: false, notes: "Adequate depth" },
      hurdleStep: { score: 2, pain: false, notes: "Minor compensation" },
      inLineLunge: { score: 2, pain: false, notes: "Good stability" },
      shoulderMobility: { score: 2, pain: false, notes: "Moderate restriction" },
      activeStraightLeg: { score: 3, pain: false, notes: "Excellent flexibility" },
      trunkStabilityPushup: { score: 2, pain: false, notes: "Adequate strength" },
      rotaryStability: { score: 3, pain: false, notes: "Good control" }
    },
    totalScore: 16,
    assessorNotes: "Focus on shoulder mobility and core strengthening exercises."
  }
];

export const fmsExercises = [
  {
    id: "deepSquat",
    name: "Deep Squat",
    description: "Assesses bilateral, symmetrical, and functional mobility of the hips, knees, and ankles, as well as bilateral, symmetrical functional mobility of the shoulders.",
    instructions: "Stand with feet shoulder-width apart, toes pointing forward. Hold dowel overhead with arms extended. Squat down as far as possible while keeping torso upright and heels on ground.",
    scoringCriteria: {
      3: "Upper torso is parallel with tibia or toward vertical. Femur below horizontal. Knees are aligned over feet. Dowel aligned over feet.",
      2: "Upper torso is parallel with tibia or toward vertical. Femur below horizontal. Knees are aligned over feet. Dowel aligned over feet with heels elevated.",
      1: "Tibia and upper torso are not parallel. Femur is not below horizontal. Knees are not aligned over feet. Dowel is not aligned over feet.",
      0: "Pain associated with any portion of this movement"
    }
  },
  {
    id: "hurdleStep",
    name: "Hurdle Step",
    description: "Challenges the body's step and stride mechanisms while maintaining stability and control of the pelvis and torso.",
    instructions: "Stand behind hurdle with feet together and toes touching base. Place dowel across shoulders. Step over hurdle with one leg while maintaining balance.",
    scoringCriteria: {
      3: "Hips, knees, and ankles remain aligned in sagittal plane. Minimal to no movement of lumbar spine. Dowel remains parallel to hurdle.",
      2: "Alignment is lost between hips, knees, and ankles. Movement is noted in lumbar spine. Dowel remains parallel to hurdle.",
      1: "Alignment is lost between hips, knees, and ankles. Movement is noted in lumbar spine. Dowel does not remain parallel to hurdle.",
      0: "Pain associated with any portion of this movement"
    }
  },
  {
    id: "inLineLunge",
    name: "In-Line Lunge",
    description: "Attempts to place the body in a position that will challenge hip and ankle mobility and stability, quadriceps flexibility, and knee stability.",
    instructions: "Place dowel along spine touching back of head, upper back, and sacrum. Step back into lunge position with feet in line. Lower back knee to touch board behind heel.",
    scoringCriteria: {
      3: "Dowel maintains contact with head, thoracic spine, and sacrum. No torso movement. Dowel remains vertical. Knee touches behind heel.",
      2: "Dowel maintains contact with head, thoracic spine, and sacrum. No torso movement. Dowel remains vertical. Knee does not touch behind heel.",
      1: "Dowel does not maintain contact with head, thoracic spine, and sacrum. Movement is noted in torso. Dowel does not remain vertical.",
      0: "Pain associated with any portion of this movement"
    }
  },
  {
    id: "shoulderMobility",
    name: "Shoulder Mobility",
    description: "Assesses bilateral shoulder range of motion, combining internal rotation with adduction and external rotation with abduction.",
    instructions: "Stand with feet together. Make fists with thumbs inside. Place one fist overhead and reach down spine. Place other fist behind back and reach up spine.",
    scoringCriteria: {
      3: "Fists are within one hand length of each other.",
      2: "Fists are within one and a half hand lengths of each other.",
      1: "Fists are not within one and a half hand lengths of each other.",
      0: "Pain associated with any portion of this movement"
    }
  },
  {
    id: "activeStraightLeg",
    name: "Active Straight-Leg Raise",
    description: "Assesses the ability to disassociate the lower extremities while maintaining stability in the torso and pelvis.",
    instructions: "Lie supine with arms at sides. Raise one leg with knee straight and ankle dorsiflexed. Opposite leg remains straight and in contact with floor.",
    scoringCriteria: {
      3: "Vertical line from malleolus bisects or passes in front of mid-patella of raised leg. Opposite leg remains in neutral position.",
      2: "Vertical line from malleolus falls behind mid-patella but in front of mid-thigh of raised leg. Opposite leg remains in neutral position.",
      1: "Vertical line from malleolus falls behind mid-thigh of raised leg. Opposite leg does not remain in neutral position.",
      0: "Pain associated with any portion of this movement"
    }
  },
  {
    id: "trunkStabilityPushup",
    name: "Trunk Stability Push-up",
    description: "Assesses the ability to stabilize the spine in an anterior/posterior plane during closed-chain upper body movement.",
    instructions: "Lie prone with hands placed at appropriate position. Perform push-up maintaining rigid body position. Men start with thumbs at forehead level, women at chin level.",
    scoringCriteria: {
      3: "Performs one repetition with thumbs at forehead level (men) or chin level (women). Body lifts as a unit with no 'lag' in lumbar spine.",
      2: "Performs one repetition with thumbs at chin level (men) or clavicle level (women). Body lifts as a unit with no 'lag' in lumbar spine.",
      1: "Unable to perform one repetition with thumbs at chin level (men) or clavicle level (women).",
      0: "Pain associated with any portion of this movement"
    }
  },
  {
    id: "rotaryStability",
    name: "Rotary Stability",
    description: "Assesses multi-planar pelvis, core, and shoulder girdle stability during combined upper and lower extremity motion.",
    instructions: "Begin in quadruped position. Extend opposite arm and leg. Perform 'bird dog' movement touching elbow to knee and returning to extended position.",
    scoringCriteria: {
      3: "Performs one correct unilateral repetition. Knee and elbow touch in unison. Returns to start position maintaining stability.",
      2: "Performs one correct bilateral repetition. Knee and elbow touch in unison. Returns to start position maintaining stability.",
      1: "Unable to perform one repetition of bilateral pattern while maintaining stability.",
      0: "Pain associated with any portion of this movement"
    }
  }
];