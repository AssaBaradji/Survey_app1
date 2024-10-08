const { connectToDB, closeDB } = require("./config/database");

async function getNextId(collectionName, db) {
  const latestItem = await db
    .collection(collectionName)
    .find()
    .sort({ questionId: -1 })
    .limit(1)
    .toArray();

  return latestItem.length > 0 ? latestItem[0].questionId + 1 : 1;
}

async function getQuestions() {
  const { db } = await connectToDB();
  try {
    const questions = await db.collection("questions").find().toArray();
    console.log("Questions:", questions);
  } finally {
    await closeDB();
  }
}

async function getQuestionById(id) {
  const { db } = await connectToDB();
  try {
    const question = await db
      .collection("questions")
      .findOne({ questionId: id });
    if (question) {
      console.log("Question obtenue:", question);
    } else {
      console.log(`Question avec l'ID "${id}" non trouvée.`);
    }
  } finally {
    await closeDB();
  }
}

async function addQuestion(question) {
  const { db } = await connectToDB();
  try {
    if (
      !question.questionId ||
      !question.surveyId ||
      !question.title ||
      !question.type ||
      typeof question.options !== "object"
    ) {
      console.log(
        "Erreur: Les propriétés questionId, surveyId, title, type, et options sont requises."
      );
      return;
    }

    const surveyExists = await db
      .collection("surveys")
      .findOne({ surveyId: question.surveyId });
    if (!surveyExists) {
      console.log(
        `Erreur: Le surveyId ${question.surveyId} spécifié n'existe pas.`
      );
      return;
    }

    question.questionId = await getNextId("questions", db);
    const result = await db.collection("questions").insertOne(question);
    console.log(
      `Nouvelle question avec l'ID ${question.questionId} ajoutée avec succès.`
    );
    return result.insertedId;
  } catch (error) {
    console.error(
      `Erreur lors de l'ajout de la question avec l'ID ${question.questionId}: ${error.message}`
    );
  } finally {
    await closeDB();
  }
}

async function updateQuestion(id, updatedQuestion) {
  const { db } = await connectToDB();
  try {
    const existingQuestion = await db
      .collection("questions")
      .findOne({ questionId: id });
    if (!existingQuestion) {
      console.log(`ID ${id} non trouvé. Erreur de mise à jour.`);
      return;
    }

    await db
      .collection("questions")
      .updateOne({ questionId: id }, { $set: updatedQuestion });

    console.log(`Question avec l'ID ${id} mise à jour avec succès.`);
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de la question avec l'ID ${id}: ${error.message}`
    );
  } finally {
    await closeDB();
  }
}

async function deleteQuestion(id) {
  const { db } = await connectToDB();
  try {
    const existingQuestion = await db
      .collection("questions")
      .findOne({ questionId: id });
    if (!existingQuestion) {
      console.log("ID non trouvé. Erreur de suppression.");
      return;
    }

    const result = await db
      .collection("questions")
      .deleteOne({ questionId: id });
    if (result.deletedCount === 0) {
      console.log("Erreur de suppression: Aucune suppression effectuée.");
    } else {
      console.log("Question supprimée avec succès");
    }
  } finally {
    await closeDB();
  }
}

module.exports = {
  getQuestions,
  getQuestionById,
  addQuestion,
  updateQuestion,
  deleteQuestion,
};
