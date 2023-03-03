const Planner = require("../model/PlannerSchema");
const { v4: uuidv4 } = require("uuid");
const Cookies = require("js-cookie")

exports.createPlanner = async (req, res) => {
  const userId = "5613e7a0-4708-46d8-9f26-d8f6d1cdc281";
  const { title, diaHoraAdicionado, conteudo, comentarios, start, end, events } = req.body;

  const planner = new Planner({
    id: uuidv4(),
    user_Id: userId,
    title,
    diaHoraAdicionado,
    conteudo,
    comentarios,
    start,
    end,
    events,
  });

  try {
    const result = await planner.save();
    res.status(201).json({
      message: "Planner criado com sucesso",
      planner: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erro ao criar planner",
    });
  }
};

exports.findUserPlanners = (req, res) => {
  try {
    const userId = req.params.user_Id;
    Planner.find({ user_Id: userId })
      .then((planners) => {
        res.status(200).json({
          message: "Planners found for user",
          planners: planners,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Error finding planners for user",
          error: error,
        });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error finding user planners" });
  }
};

exports.findAllPlanners = (req, res) => {
  Planner.find()
    .then((result) => {
      res.status(200).json({
        message: "Planner list",
        planners: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};

exports.findPlannerById = (req, res) => {
  const id = req.params.id;

  Planner.findOne({ id: id })
    .then((result) => {
      res.status(200).json({
        message: "Planner found",
        planner: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};

exports.UpdatePlanner = (req, res) => {
  const id = req.params.id;
  const updateOps = req.body;

  Planner.updateOne({ id: id }, { $set: updateOps })
    .then((result) => {
      res.status(200).json({
        message: "Planner updated",
        result: result,
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};

exports.DeletePlanner = (req, res) => {

  Planner.findByIdAndDelete(req.params.id)
    .then((user) => res.json({ msg: "Planner excluído com sucesso" }))
    .catch((err) =>
      res
        .status(404)
        .json({ noplannerfound: "Nenhum Planner encontrado com esse ID" })
    );
};
