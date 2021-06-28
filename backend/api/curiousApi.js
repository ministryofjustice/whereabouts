/**
 * TODO: remove this during the curious api integration
 */
const dummyLearnerProfiles = [
  {
    prn: 'G8346GA',
    establishmentId: 2,
    establishmentName: 'HMP Winchester',
    uln: '345455',
    lddHealthProblem: 'Dyslexia',
    priorAttainment: '',
    qualifications: [
      {
        qualificationType: 'English',
        qualificationGrade: 'c',
        assessmentDate: '2021-06-22',
      },
    ],
    languageStatus: 'string',
    plannedHours: '8',
  },
  {
    prn: 'G8346GA',
    establishmentId: 2,
    establishmentName: 'HMP Winchester',
    uln: '345455',
    lddHealthProblem: 'Autistic spectrum disorder',
    priorAttainment: '',
    qualifications: [
      {
        qualificationType: 'Maths',
        qualificationGrade: 'A',
        assessmentDate: '2021-06-22',
      },
    ],
    languageStatus: 'string',
    plannedHours: '8',
  },
]

const dummyFunctionalSkillsLevels = [
  {
    prn: 'G8346GA',
    qualifications: [
      {
        establishmentId: 2,
        establishmentName: 'HMP Winchester',
        qualification: {
          qualificationType: 'English',
          qualificationGrade: 'Entry Level 2',
          assessmentDate: '2021-05-02',
        },
      },
      {
        establishmentId: 2,
        establishmentName: 'HMP Winchester',
        qualification: {
          qualificationType: 'English',
          qualificationGrade: 'Entry Level 2',
          assessmentDate: '2020-12-02',
        },
      },
      {
        establishmentId: 2,
        establishmentName: 'HMP Winchester',
        qualification: {
          qualificationType: 'Digital Literacy',
          qualificationGrade: 'Entry Level 1',
          assessmentDate: '2020-06-01',
        },
      },
      {
        establishmentId: 2,
        establishmentName: 'HMP Winchester',
        qualification: {
          qualificationType: 'Digital Literacy',
          qualificationGrade: 'Entry Level 2',
          assessmentDate: '2021-06-01',
        },
      },
    ],
  },
]

const curiousApiFactory = _ => ({
  getLearnerProfiles() {
    return Promise.resolve(dummyLearnerProfiles)
  },
  getLearnerLatestAssessments() {
    return Promise.resolve(dummyFunctionalSkillsLevels)
  },
})

module.exports = { curiousApiFactory, dummyLearnerProfiles, dummyFunctionalSkillsLevels }
