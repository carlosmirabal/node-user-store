import { bcryptAdapter, envs } from "../../config";
import { JwtAdapter } from "../../config/jwt.adapter";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";

export class AuthService {

    // DI
    constructor(private readonly emailService: EmailService) { }

    public async registerUser(registerUserDto: RegisterUserDto) {
        const { email } = registerUserDto;

        const existUser = await UserModel.findOne({ email })

        if (existUser) throw CustomError.badRequest("User already exists");

        try {

            const user = new UserModel(registerUserDto);

            // Encriptar la contraseña
            user.password = bcryptAdapter.hash(registerUserDto.password)

            user.save();

            // Email confirmation
            await this.sendEmailValidationLink(user.email);

            const { password, ...userEntity } = UserEntity.fromObject(user);

            const token = await JwtAdapter.generateToken({ id: user.id });
            if (!token) throw CustomError.internalServer("Error while creating JWT")

            return { user: userEntity, token };

        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }

    public async loginUser(loginUserDto: LoginUserDto) {
        // Find user
        const user = await UserModel.findOne({ email: loginUserDto.email })

        if (!user) throw CustomError.badRequest("Email not exist");

        // Compare password
        const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password)

        if (!isMatching) throw CustomError.badRequest("Invalid password");

        const { password, ...userEntity } = UserEntity.fromObject(user);

        // Generate token
        const token = await JwtAdapter.generateToken({ id: user.id });

        if (!token) throw CustomError.internalServer("Error while creating JWT")

        // Return user and token
        return { user: userEntity, token };
    }


    private sendEmailValidationLink = async (email: string) => {
        const token = await JwtAdapter.generateToken({ email });
        if (!token) throw CustomError.internalServer("Error while creating JWT");

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

        const html = `
            <h1>Validate your email</h1>
            <p>Click on the following link to validate your email</p>
            <a href="${link}">Validate your email: ${email}</a>
        `
        const options = {
            to: email,
            subject: "Validate your email",
            htmlBody: html
        }

        const isSent = await this.emailService.sendEmail(options);
        if (!isSent) throw CustomError.internalServer("Error sending email");

        return true;
    }

    public validateEmail = async (token: string) => {
        const payload = await JwtAdapter.validateToken(token);
        if (!payload) throw CustomError.unAuthorized("Invalid token");

        const { email } = payload as { email: string };
        if (!email) throw CustomError.internalServer("Email not in token");

        const user = await UserModel.findOne({ email })
        if (!user) throw CustomError.badRequest("Email not exist");

        user.emailValidated = true;
        await user.save();

        return true;
    }
}