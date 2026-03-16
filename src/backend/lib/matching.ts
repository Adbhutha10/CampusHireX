/**
 * Matching Algorithm for CampusHireX
 * 
 * Calculates a match percentage (0-100) based on:
 * - Skill Overlap (70%): How many required skills the student possesses.
 * - CGPA Alignment (30%): How much the student's CGPA exceeds the minimum criteria.
 */

export interface MatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  isEligible: boolean;
}

export function calculateMatchScore(
  studentSkills: string = "",
  studentCgpa: number = 0,
  requiredSkills: string = "",
  minCgpa: number = 0
): MatchResult {
  // 1. Process Skills
  const studentSkillList = studentSkills
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0);
  
  const requiredSkillList = requiredSkills
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0);

  let skillScore = 0;
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  if (requiredSkillList.length === 0) {
    // If no specific skills are required, give a base skill score
    skillScore = 100;
  } else {
    requiredSkillList.forEach((skill) => {
      if (studentSkillList.includes(skill)) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });
    skillScore = (matchedSkills.length / requiredSkillList.length) * 100;
  }

  // 2. Process CGPA
  let cgpaScore = 0;
  const isEligible = studentCgpa >= minCgpa;

  if (isEligible) {
    // If eligible, base score is 70. Extra 30 points for how much they exceed the criteria.
    // Max extra points if CGPA is 10.0
    const buffer = 10 - minCgpa;
    if (buffer > 0) {
      const extra = ((studentCgpa - minCgpa) / buffer) * 30;
      cgpaScore = 70 + extra;
    } else {
      cgpaScore = 100;
    }
  } else {
    // If not eligible, score based on how close they are
    cgpaScore = (studentCgpa / minCgpa) * 50;
  }

  // 3. Weighting
  // 70% Skills, 30% CGPA
  const finalScore = Math.round(skillScore * 0.7 + cgpaScore * 0.3);

  return {
    score: Math.min(100, finalScore),
    matchedSkills,
    missingSkills,
    isEligible,
  };
}
