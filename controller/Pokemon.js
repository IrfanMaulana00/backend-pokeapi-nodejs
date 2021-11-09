import Pokemon from "../models/Pokemon.js";
import axios from "axios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";

export const getPokemon = async (req, res) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=16&offset=100`);
        if ( !response.data.results ) return res.json({message: "Failed load data"});
        
        const promises = [];
        let splitUrl, idPokemon;
        response.data.results.forEach(val => {
            splitUrl = val.url.split('/');
            idPokemon = splitUrl[splitUrl.length-2];
            promises.push({id: idPokemon, nama: val.name, url:val.url});
        });
        res.json(promises);
    } catch (error) {
        res.json({message: "Failed load data"});
    }
}

function getAllEvolutions(node) {
	var storageArray = [];
	storageArray.push(node.species.url);

	var evolutionNodes = node.evolves_to;

	for (var i = 0; i < evolutionNodes.length; i++) {
		storageArray = storageArray.concat(getAllEvolutions(evolutionNodes[i]));
	}

	return storageArray;
}

export const getPokemonById = async (req, res) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${req.params.id}`);
        if ( !response.data ) return res.json({message: "Failed load data"});
        
        const dataAbility = [];
        for (const ability of response.data.abilities) {
            const getData = await axios.get(ability.ability.url);
            dataAbility.push({name:ability.ability.name, details: getData.data.effect_entries[1].effect});
        }
        
        const getSpecialUrl = await axios.get(response.data.species.url);
        const getEvolusi = await axios.get(getSpecialUrl.data.evolution_chain.url);
        const dataEvolusi = await getAllEvolutions(getEvolusi.data.chain);
        
        res.json({data: response.data, ability: dataAbility, imgEvolusi: dataEvolusi});
    } catch (error) {
        console.log(error);
        res.json({message: "Failed load data"});
    }
}

export const myPokemon = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt_decode(token);
        
        const myPoke = await Pokemon.findAll({
            where:{
                id_user: decoded.userId
            }
        });
        
        res.json(myPoke);
    } catch (error) {
        console.log(error);
    }
}

export const tangkap = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt_decode(token);
        const poke = await Pokemon.findAll({
            where:{
                id_user: decoded.userId,
                id_pokemon: req.params.id
            }
        });
        
        if (poke.length > 0) return res.json({status: false, message: "Pokemon sudah dimiliki"});

        const keberhasilan = Math.random() < 0.5;
        if ( keberhasilan == false ) return res.json({status: false, message: "Gagal mendapatkan pokemon"});

        await Pokemon.create({
            id_user: decoded.userId,
            id_pokemon: req.params.id,
            nama: null
        });
        
        res.json({status: true, message: "Berhasil mendapatkan pokemon"});
    } catch (error) {
        console.log(error);
    }
}

export const getPokeById = async (id) => {
    try {
        const pokemon = await Pokemon.findAll({
			where: {
				id: id
			}
		});
		return pokemon[0];
    } catch (error) {
        console.log(error)
        return false;
    }
}

function fibonacci(num) {
    if (num <= 1) return 1;
  
    return fibonacci(num - 1) + fibonacci(num - 2);
}

export const updatePokemon = async (req, res) => {
	try{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt_decode(token);

        const getPoke = await getPokeById(req.params.id);
        console.log(getPoke);
        if ( getPoke == false || getPoke.id_user != decoded.userId ) return res.json({ status: false, message: "Data tidak ditemukan" });
        
        const totalEdit = getPoke.jumlah_edit;
        const unik = totalEdit == 0 ? 0 : (totalEdit == 1) ? 1 : fibonacci(totalEdit-1);
        
        console.log(req.body);
        const newName = `${req.body.nama}-${unik}`;
		await Pokemon.update({nama: newName, jumlah_edit: totalEdit+1}, {
			where: {
				id: req.params.id,
                id_user: decoded.userId,
			}
		});
		res.json({
            status: true,
			message: "Pokemon Updated"
		})
	} catch (error) {
		res.json({ status: false, message: error.message });
	}
}

const isPrima = async (angka) => {
    let pembagi = 0;
    for(let i=1; i <= angka; i++){
        if(angka%i == 0){
            pembagi++
        }
    }
    if(pembagi == 2) return true;
    return false;
}

export const deletePokemon = async (req, res) => {
	try{
        
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt_decode(token);

        const nilai = Math.floor(Math.random() * 100)+1;
        const cekNilai = await isPrima(nilai);
        if ( cekNilai == false ) return res.json({status: false, message: "Gagal melepaskan pokemon "+nilai});

		await Pokemon.destroy({
			where: {
				id: req.params.id,
                id_user: decoded.userId,
			}
		});
		res.json({
            status: true,
			message: "Pokemon berhasil dilepaskan "+nilai
		})
	} catch (error) {
		res.json({ status: false, message: error.message });
	}
}