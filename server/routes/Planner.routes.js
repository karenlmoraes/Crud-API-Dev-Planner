const express = require('express');
const router = express.Router();
const userController = require('../controller/Planner.Controller');

const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // permite enviar cookies
}));

router.post('/', userController.createPlanner); /* Criar um Planner */
router.get('/', userController.findAllPlanners);/* Achar Todos */
router.get('/:id', userController.findPlannerById);/* Achar pelo id */
router.patch('/:id', userController.UpdatePlanner);/* Update no Planner pelo id */
router.delete('/:id', userController.DeletePlanner);/* Deletar o Planner pelo id */
router.get('/user/:user_Id', userController.findUserPlanners)

module.exports = router;