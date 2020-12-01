import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as EmailValidator from 'email-validator';
import { config } from '../../../config/config';

const router: Router = Router();

async function generatePassword(plainTextPassword: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(plainTextPassword, salt);
            resolve(hash);
        } catch(error) {
            reject(error);
        }
    })
}

function generateJWT(user: User): string {
    return jwt.sign(user.toJSON(), config.jwt.secret);
}

router.get('/users', async (req: Request, res: Response) => {
    res.send("Hello, this is user microservice")
});

router.get('/users/:id', async (req: Request, res: Response) => {
    let { id } = req.params;
    const item = await User.findByPk(id);
    res.send(item);
});

//register a new user
router.post('/users', async (req: Request, res: Response) => {
    const email = req.body.email;
    const plainTextPassword = req.body.password;
    // check email is valid
    if (!email || !EmailValidator.validate(email)) {
        return res.status(400).send({ auth: false, message: 'Email is required or malformed' });
    }

    // check email password valid
    if (!plainTextPassword) {
        return res.status(400).send({ auth: false, message: 'Password is required' });
    }

    // find the user
    const user = await User.findByPk(email);
    // check that user doesnt exists
    if(user) {
        return res.status(422).send({ auth: false, message: 'User may already exist' });
    }

    const password_hash = await generatePassword(plainTextPassword);

    const newUser = await new User({
        email: email,
        password_hash: password_hash
    });

    let savedUser;
    try {
        savedUser = await newUser.save();
    } catch (e) {
        throw e;
    }

    // Generate JWT
    const jwt = generateJWT(savedUser);
    res.status(201).send({token: jwt, user: savedUser.short()});
});

export const UserRouter: Router = router;