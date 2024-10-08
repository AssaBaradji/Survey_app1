const {
  addSurvey,
  getSurveys,
  getSurveyById,
  updateSurvey,
  deleteSurvey,
} = require("./surveyModule");

const {
  addQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} = require("./questionModule");

const {
  addAnswer,
  getAnswers,
  getAnswerById,
  updateAnswer,
  deleteAnswer,
} = require("./answerModule");

const surveyData = {
  surveyId: 1,
  name: "Satisfaction client",
  description: "Évaluez notre service",
  createdAt: "2024-07-25T08:00:00Z",
  createdBy: {
    employeeName: "Jane Smith",
    employeeRole: "Responsable du service client",
  },
};

const questionData = {
  questionId: 1,
  surveyId: 1,
  title: "Comment évalueriez-vous notre service ?",
  type: "rating",
  options: {minValue: 1, maxValue: 5, step: 1},
};

const answerData = {
  answerId: 1,
  questionId: 1,
  title: "Très satisfait",
};

async function main() {
  try {
    await addSurvey(surveyData);

    await getSurveys();

    await getSurveyById(1);

    await updateSurvey(1, {
      name: "Satisfaction client - mise à jour",
      description: "Mise à jour de l'évaluation",
    });

    await deleteSurvey(2);

    await addQuestion(questionData);

    await getQuestions();

    await getQuestionById(1);

    await updateQuestion(1, {
      title: "Comment évaluez-vous notre service ? (Mise à jour)",
    });

    await deleteQuestion(2);

    await addAnswer(answerData);

    await getAnswers();

    await getAnswerById(1);

    await updateAnswer(1, {
      title: "Satisfait (Mise à jour)",
    });

    await deleteAnswer(1);
  } catch (error) {
    console.error("Erreur :", error.message);
  }
}

main();
