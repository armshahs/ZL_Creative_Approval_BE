import { AppDataSource } from "../database";
import { In } from "typeorm";
import { User, Brand } from "../models";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils";
import { sendResetEmail } from "../utils";
import { ROLES, RoleType } from "../config";

const userRepository = AppDataSource.getRepository(User);
const brandRepository = AppDataSource.getRepository(Brand);

export class AuthService {
  // SignUp --------------------------------------------------------
  static async signUp(
    email: string,
    password: string,
    role: RoleType = ROLES.TEAM_MEMBER,
    name: string,
    brands: string[] = [], // Default to an empty array
  ) {
    // const hashedPassword = await bcrypt.hash(password, 10);
    // Run hashing and brand fetching in parallel for optimization
    const [hashedPassword, brandEntities] = await Promise.all([
      bcrypt.hash(password, 10), // Hashing password in parallel
      brands.length > 0
        ? brandRepository.findBy({ id: In(brands) })
        : Promise.resolve([]), // Fetch brands if needed
    ]);
    const user = userRepository.create({
      email,
      password: hashedPassword,
      role,
      name,
      brands: brandEntities.length > 0 ? brandEntities : undefined, // Assign brands if found
    });
    await userRepository.save(user);
    const token = generateToken(user.id, user.role);
    return { token, userId: user.id, role: user.role, brands: user.brands };
  }

  // Login ----------------------------------------------------------------------------
  static async login(email: string, password: string) {
    const user = await userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid credentials");
    }
    const token = generateToken(user.id, user.role);
    return { token, userId: user.id, role: user.role };
  }

  // Reset password Request -----------------------------------------------------------------------
  static async resetPasswordRequest(email: string) {
    const user = await userRepository.findOne({ where: { email } });
    if (!user) throw new Error("User not found");

    const resetToken = generateToken(user.id, user.role);
    user.resetToken = resetToken;
    await userRepository.save(user);

    await sendResetEmail(email, resetToken);
  }

  static async resetPasswordConfirm(
    token: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    const user = await userRepository.findOne({ where: { resetToken: token } });
    if (!user) throw new Error("Invalid token");

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = "";
    await userRepository.save(user);
  }

  // Get specific user details -------------------------------------------------------------
  static async getUserDetails(userId: string) {
    return await userRepository.findOne({
      where: { id: userId },
      select: ["id", "email", "role", "name", "brands"],
      relations: ["brands"],
    });
  }

  // Get all users - for Admin use --------------------------------------------
  static async getAllUsers() {
    return await userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.pod", "pod") // Join the pod relation
      .select([
        "user.id",
        "user.email",
        "user.role",
        "user.name",
        "pod.id",
        "pod.name",
      ])
      .orderBy("user.name", "ASC") // Sort by name in ascending order
      .getMany();
  }

  // Get all employees - for Admin use -------------------------------------------
  static async getAllEmployees() {
    return await userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.pod", "pod") // Join the pod relation
      .select([
        "user.id",
        "user.email",
        "user.role",
        "user.name",
        "pod.id",
        "pod.name",
      ])
      .where("user.role != :clientRole", { clientRole: ROLES.CLIENT }) // Exclude clients
      .orderBy("user.name", "ASC") // Sort by name in ascending order
      .getMany();
  }

  // Update role for a specific user - for Admin use ------------------------------------
  static async updateUserData(
    userId: string,
    role: string,
    name: string,
    brands: string[] = [], // Default to an empty array
  ): Promise<User | null> {
    const [user, brandEntities] = await Promise.all([
      userRepository.findOne({
        where: { id: userId },
        select: ["id", "name", "email", "role"],
        relations: ["brands"], // Ensure brands relation is loaded
      }),
      brands.length > 0
        ? brandRepository.find({
            where: { id: In(brands) },
          })
        : Promise.resolve([]),
    ]);
    console.log(brandEntities);

    if (!user) {
      return null; // User not found
    }

    user.role = role as RoleType;
    user.name = name;
    user.brands = brandEntities; // If no brands found, assign an empty array

    await userRepository.save(user);
    return user;
  }

  // Delete user - admin access
  static async deleteUser(userId: string) {
    await userRepository.delete(userId);
  }
}
