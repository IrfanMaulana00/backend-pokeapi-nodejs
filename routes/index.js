import express from "express";
import { getUsers, Register, Login, Logout } from "../controller/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controller/RefreshToken.js";
import { getPokemon, getPokemonById, myPokemon, tangkap, updatePokemon, deletePokemon } from "../controller/Pokemon.js";

const router = express.Router();

router.get('/users', verifyToken, getUsers);
router.get('/tangkap/:id', verifyToken, tangkap);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.get('/pokemon', getPokemon);
router.get('/pokemon/:id', getPokemonById);
router.get('/my-pokemon', verifyToken, myPokemon);
router.patch('/update-pokemon/:id', verifyToken, updatePokemon);
router.delete('/delete-pokemon/:id', verifyToken, deletePokemon);

export default router;