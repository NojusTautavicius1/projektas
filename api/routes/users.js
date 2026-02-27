import express from "express";
const router = express.Router();

import * as userController from "../controllers/user.js";

// apribojimas - tik autentifikuoti vartotojai su admin rolė gali pasiekti šiuos maršrutus
import { isAuth, isAdmin } from "../controllers/auth.js";

router.use(isAuth);

// API CRUD Resursas - users
// FUNCIJA - HTTP METODAS - URL - KONTROLERIO FUNKCIJA - API VEIKSMAS
// CREATE - POST - /users - store(data) - sukurti naują vartotoją
// READ - GET - /users - index() - gauti visų vartotojų sąrašą
// READ - GET - /users/:id - show(id) - gauti vartotojo informaciją pagal ID
// UPDATE - PUT - /users/:id - update(id, data) - atnaujinti vartotojo informaciją pagal ID
// DELETE - DELETE - /users/:id - destroy(id) - ištrinti vartotoją pagal ID


// vartotojų sąrašas
router.get("/", userController.index);

// vartotojo informacija pagal ID
router.get("/:id", userController.show);

// vartotojo kūrimas
router.post("/", userController.store);

// vartotojo atnaujinimas pagal ID
router.put("/:id", userController.update);

// vartotojo ištrinimas pagal ID
router.delete("/:id", userController.destroy);


// vartotojo slaptažodžio atnaujinimas pagal ID
router.patch("/:id/password", userController.updatePassword);

// vartotojo rolės atnaujinimas pagal ID
router.patch("/:id/role", userController.updateRole);

// vartotojo būsenos atnaujinimas pagal ID
router.patch("/:id/status", userController.updateStatus);

export default router;
