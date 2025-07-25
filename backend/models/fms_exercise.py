from pydantic import BaseModel
from typing import Dict

class FMSExercise(BaseModel):
    id: str
    name: str
    description: str
    instructions: str
    scoring_criteria: Dict[str, str]

# Static FMS exercises data
FMS_EXERCISES = [
    FMSExercise(
        id="deepSquat",
        name="Deep Squat",
        description="Assesses bilateral, symmetrical, and functional mobility of the hips, knees, and ankles, as well as bilateral, symmetrical functional mobility of the shoulders.",
        instructions="Stand with feet shoulder-width apart, toes pointing forward. Hold dowel overhead with arms extended. Squat down as far as possible while keeping torso upright and heels on ground.",
        scoring_criteria={
            "3": "Upper torso is parallel with tibia or toward vertical. Femur below horizontal. Knees are aligned over feet. Dowel aligned over feet.",
            "2": "Upper torso is parallel with tibia or toward vertical. Femur below horizontal. Knees are aligned over feet. Dowel aligned over feet with heels elevated.",
            "1": "Tibia and upper torso are not parallel. Femur is not below horizontal. Knees are not aligned over feet. Dowel is not aligned over feet.",
            "0": "Pain associated with any portion of this movement"
        }
    ),
    FMSExercise(
        id="hurdleStep",
        name="Hurdle Step",
        description="Challenges the body's step and stride mechanisms while maintaining stability and control of the pelvis and torso.",
        instructions="Stand behind hurdle with feet together and toes touching base. Place dowel across shoulders. Step over hurdle with one leg while maintaining balance.",
        scoring_criteria={
            "3": "Hips, knees, and ankles remain aligned in sagittal plane. Minimal to no movement of lumbar spine. Dowel remains parallel to hurdle.",
            "2": "Alignment is lost between hips, knees, and ankles. Movement is noted in lumbar spine. Dowel remains parallel to hurdle.",
            "1": "Alignment is lost between hips, knees, and ankles. Movement is noted in lumbar spine. Dowel does not remain parallel to hurdle.",
            "0": "Pain associated with any portion of this movement"
        }
    ),
    FMSExercise(
        id="inLineLunge",
        name="In-Line Lunge",
        description="Attempts to place the body in a position that will challenge hip and ankle mobility and stability, quadriceps flexibility, and knee stability.",
        instructions="Place dowel along spine touching back of head, upper back, and sacrum. Step back into lunge position with feet in line. Lower back knee to touch board behind heel.",
        scoring_criteria={
            "3": "Dowel maintains contact with head, thoracic spine, and sacrum. No torso movement. Dowel remains vertical. Knee touches behind heel.",
            "2": "Dowel maintains contact with head, thoracic spine, and sacrum. No torso movement. Dowel remains vertical. Knee does not touch behind heel.",
            "1": "Dowel does not maintain contact with head, thoracic spine, and sacrum. Movement is noted in torso. Dowel does not remain vertical.",
            "0": "Pain associated with any portion of this movement"
        }
    ),
    FMSExercise(
        id="shoulderMobility",
        name="Shoulder Mobility",
        description="Assesses bilateral shoulder range of motion, combining internal rotation with adduction and external rotation with abduction.",
        instructions="Stand with feet together. Make fists with thumbs inside. Place one fist overhead and reach down spine. Place other fist behind back and reach up spine.",
        scoring_criteria={
            "3": "Fists are within one hand length of each other.",
            "2": "Fists are within one and a half hand lengths of each other.",
            "1": "Fists are not within one and a half hand lengths of each other.",
            "0": "Pain associated with any portion of this movement"
        }
    ),
    FMSExercise(
        id="activeStraightLeg",
        name="Active Straight-Leg Raise",
        description="Assesses the ability to disassociate the lower extremities while maintaining stability in the torso and pelvis.",
        instructions="Lie supine with arms at sides. Raise one leg with knee straight and ankle dorsiflexed. Opposite leg remains straight and in contact with floor.",
        scoring_criteria={
            "3": "Vertical line from malleolus bisects or passes in front of mid-patella of raised leg. Opposite leg remains in neutral position.",
            "2": "Vertical line from malleolus falls behind mid-patella but in front of mid-thigh of raised leg. Opposite leg remains in neutral position.",
            "1": "Vertical line from malleolus falls behind mid-thigh of raised leg. Opposite leg does not remain in neutral position.",
            "0": "Pain associated with any portion of this movement"
        }
    ),
    FMSExercise(
        id="trunkStabilityPushup",
        name="Trunk Stability Push-up",
        description="Assesses the ability to stabilize the spine in an anterior/posterior plane during closed-chain upper body movement.",
        instructions="Lie prone with hands placed at appropriate position. Perform push-up maintaining rigid body position. Men start with thumbs at forehead level, women at chin level.",
        scoring_criteria={
            "3": "Performs one repetition with thumbs at forehead level (men) or chin level (women). Body lifts as a unit with no 'lag' in lumbar spine.",
            "2": "Performs one repetition with thumbs at chin level (men) or clavicle level (women). Body lifts as a unit with no 'lag' in lumbar spine.",
            "1": "Unable to perform one repetition with thumbs at chin level (men) or clavicle level (women).",
            "0": "Pain associated with any portion of this movement"
        }
    ),
    FMSExercise(
        id="rotaryStability",
        name="Rotary Stability",
        description="Assesses multi-planar pelvis, core, and shoulder girdle stability during combined upper and lower extremity motion.",
        instructions="Begin in quadruped position. Extend opposite arm and leg. Perform 'bird dog' movement touching elbow to knee and returning to extended position.",
        scoring_criteria={
            "3": "Performs one correct unilateral repetition. Knee and elbow touch in unison. Returns to start position maintaining stability.",
            "2": "Performs one correct bilateral repetition. Knee and elbow touch in unison. Returns to start position maintaining stability.",
            "1": "Unable to perform one repetition of bilateral pattern while maintaining stability.",
            "0": "Pain associated with any portion of this movement"
        }
    )
]