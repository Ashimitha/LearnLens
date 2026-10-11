from typing import Dict, Any, List
import uuid

def analyze_metadata(text: str, hinted_subject: str = None) -> Dict[str, str]:
    lower = text.lower()
    subject = hinted_subject or "General Science"
    topic = "Fundamental Concept"
    subtopic = "Core Principles"
    difficulty = "Intermediate"

    if any(k in lower for k in ["pencil", "refract", "light", "lens", "prism", "mirror", "optic"]):
        subject = "Physics"
        topic = "Light Refraction & Snell Law"
        subtopic = "Ray Optics & Wave Propagation"
    elif any(k in lower for k in ["photo", "plant", "leaf", "chloroplast", "stomata", "sunlight", "glucose"]):
        subject = "Biology"
        topic = "Photosynthesis & Cellular Energy"
        subtopic = "Light & Dark Reactions"
    elif any(k in lower for k in ["quadratic", "equation", "roots", "polynomial", "algebra", "formula"]):
        subject = "Mathematics"
        topic = "Quadratic Equations & Roots"
        subtopic = "Factoring & Quadratic Formula"
    elif any(k in lower for k in ["acid", "base", "ph", "salt", "atom", "molecule", "bond", "electron"]):
        subject = "Chemistry"
        topic = "Chemical Bonding & Reaction Kinetics"
        subtopic = "Acid-Base Equilibria & Ionization"
    elif any(k in lower for k in ["sort", "binary", "tree", "algorithm", "complexity", "recursion"]):
        subject = "Computer Science"
        topic = "Data Structures & Algorithms"
        subtopic = "Search & Sort Optimization"

    return {"subject": subject, "topic": topic, "subtopic": subtopic, "difficulty": difficulty}

def generate_lesson_content(text: str, meta: Dict[str, str], style: str = "step_by_step") -> Dict[str, Any]:
    subject = meta["subject"]
    topic = meta["topic"]

    is_math = subject == "Mathematics"
    is_bio = subject == "Biology"

    diagram_type = "optics" if "Light" in topic else "photosynthesis" if "Photo" in topic else "geometry" if is_math else "generic"

    short_answer = f"To understand '{text}', we examine the governing principles of {topic} in {subject}."
    core_concept = f"{topic} operates via conservation laws and defined mathematical relationships."

    if "Light" in topic:
        short_answer = "The pencil appears bent because light changes speed and refracts across the water-air optical boundary."
        core_concept = "Refraction is the direction change of a wave caused by a change in its phase velocity between different media."
    elif "Photo" in topic:
        short_answer = "Photosynthesis converts solar photons, water, and CO2 into chemical glucose energy and breathable oxygen."
        core_concept = "Photolysis splits water in thylakoid membranes to generate ATP and NADPH for the Calvin cycle."

    steps = [
        {
            "stepNumber": 1,
            "title": "Initial Boundary Setup",
            "description": f"Identify the boundary conditions and variables involved in {topic}.",
            "formula": "v = c / n" if "Light" in topic else "ax^2 + bx + c = 0" if is_math else None,
        },
        {
            "stepNumber": 2,
            "title": "Governing Law Application",
            "description": "Apply the fundamental theorem connecting the driving input to the output state.",
            "formula": "n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)" if "Light" in topic else "\\Delta = b^2 - 4ac" if is_math else None,
        },
        {
            "stepNumber": 3,
            "title": "Logical Synthesis & Verification",
            "description": "Isolate the final state and ensure units and boundary limits hold true.",
            "formula": None,
        },
    ]

    examples = [
        {
            "title": "Everyday Demonstration",
            "scenario": "A physical setup showing this mechanism outside textbook theory.",
            "takeaway": "Predictable outcomes confirm the foundational law.",
        }
    ]

    common_misconceptions = [
        {
            "myth": f"Assuming {topic} responds identically across all boundary limits.",
            "reality": "Natural laws exhibit transition thresholds and conservation boundaries.",
        }
    ]

    key_formulas = ["n_1 \\sin(\\theta_1) = n_2 \\sin(\\theta_2)", "n = c / v"] if "Light" in topic else ["x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}"]

    visual_scenes = [
        {
            "id": 1,
            "title": "Scene 1: Introduction",
            "narration": f"Visual breakdown of {topic}.",
            "diagramType": diagram_type,
            "bulletPoints": ["Boundary line", "Conservation of flow"],
            "formula": key_formulas[0],
        }
    ]

    return {
        "short_answer": short_answer,
        "core_concept": core_concept,
        "steps": steps,
        "examples": examples,
        "common_misconceptions": common_misconceptions,
        "key_formulas": key_formulas,
        "recap_points": ["State the governing equation first", "Verify boundary conditions"],
        "suggested_questions": ["What happens at boundary limits?", "Can you test me with a quiz?"],
        "visual_scenes": visual_scenes,
    }
