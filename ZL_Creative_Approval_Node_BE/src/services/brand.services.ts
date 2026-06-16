import { brand_selection, RoleType, ROLES } from "../config";
import { AppDataSource } from "../database";
import { User, Brand, Pod } from "../models";

const userRepository = AppDataSource.getRepository(User);
const brandRepository = AppDataSource.getRepository(Brand);

export class BrandService {
  // ============================================================================================
  // BRAND OWNERSHIP APIs (General Settings Tabs) - Admin acces only
  // ============================================================================================
  // Create new brand -----------------------------------------------------------
  static async createBrand(name: string, performanceMarketerId?: string) {
    // Find the performance marketer if provided
    let performanceMarketer: User | null = null; // default is null
    let pod: Pod | null = null; // `undefined` will be inferred if not set
    let podLead: User | null | undefined = null;

    if (performanceMarketerId) {
      performanceMarketer = await userRepository.findOne({
        where: { id: performanceMarketerId },
        select: ["id", "email", "name", "role"], // Select only specific fields for performance marketer
        relations: ["pod", "pod.podLeader"],
      });

      if (!performanceMarketer) {
        throw new Error("Invalid performance marketer");
      }

      // Fetch the Pod linked with the performance marketer
      pod = performanceMarketer.pod ?? null;
      podLead = pod?.podLeader;
      // console.log(podLead);
    }

    // Create the new Brand instance
    const newBrand = brandRepository.create({
      name,
      performanceMarketer,
      pod,
      podLead,
    });

    // Save the new Brand to the database
    const savedBrand = await brandRepository.save(newBrand);

    // Format the response by manually picking fields

    const brandResponse = {
      id: savedBrand.id,
      name: savedBrand.name,
      performanceMarketer: performanceMarketer
        ? {
            id: performanceMarketer.id,
            email: performanceMarketer.email,
            name: performanceMarketer.name,
          }
        : null,
      pod: pod
        ? {
            id: pod.id,
            name: pod.name,
          }
        : null,
      podLead: podLead
        ? {
            id: podLead.id,
            name: podLead.name,
            email: podLead.email,
          }
        : null,
    };

    return brandResponse;
  }

  // Get all brands (brand ownership) - admin access only -----------------------------------------------------------
  static async getAllBrandsOwnership() {
    const brands = await brandRepository
      .createQueryBuilder("brand")
      .select([
        "brand.id",
        "brand.name",
        "performanceMarketer.id",
        "performanceMarketer.name",
        "pod.id",
        "pod.name",
        // "members.id", // if you want members to be shown + edit leftJoin
        // "members.name",
      ])
      .leftJoin("brand.performanceMarketer", "performanceMarketer")
      .leftJoin("brand.pod", "pod")
      // .leftJoin("brand.members", "members") // if you want members + edit select
      .orderBy("brand.name", "ASC") // Sort by name in ascending order
      .getMany();

    return brands;
  }

  // Get specific brand details -----------------------------------------------------------
  static async getBrandDetails(brandId: string) {
    const brand = await brandRepository.findOne({
      where: { id: brandId },
      relations: ["performanceMarketer", "pod"],
      select: brand_selection,
    });

    return brand;
  }

  // Update specific brand details (Brand Ownership) -----------------------------------------------------------
  static async updateBrandDetailsOwnership(
    brandId: string,
    name: string,
    performanceMarketerId?: string,
  ) {
    // Fetch brand and performance marketer concurrently if performanceMarketerId is provided
    const [brand, newPerformanceMarketer] = await Promise.all([
      brandRepository.findOne({ where: { id: brandId } }),
      performanceMarketerId
        ? userRepository.findOne({
            where: { id: performanceMarketerId },
            relations: ["pod", "pod.podLeader"],
          })
        : null,
    ]);

    if (!brand) {
      throw new Error("Brand not found");
    }

    if (performanceMarketerId && !newPerformanceMarketer) {
      throw new Error("New performance marketer not found");
    }

    if (newPerformanceMarketer) {
      brand.performanceMarketer = newPerformanceMarketer!;
      // Set the pod and podLead fields
      const pod = newPerformanceMarketer?.pod ?? null;
      const podLead = pod?.podLeader ?? null;
      brand.pod = pod;
      brand.podLead = podLead;
    }
    brand.name = name;

    const savedBrand = await brandRepository.save(brand);

    const brandResponse = {
      id: savedBrand.id,
      name: savedBrand.name,
      performanceMarketer: newPerformanceMarketer
        ? {
            id: newPerformanceMarketer.id,
            email: newPerformanceMarketer.email,
            name: newPerformanceMarketer.name,
          }
        : null,
    };

    return brandResponse;
  }

  // Delete specific brand  -----------------------------------------------------------
  static async deleteBrand(brandId: string) {
    const brand = await brandRepository.findOne({
      where: { id: brandId },
      relations: ["performanceMarketer", "pod"], // Ensure related entities are loaded
    });

    if (!brand) {
      throw new Error("Brand not found");
    }

    await brandRepository.remove(brand); // Removes the brand

    return { message: "Brand deleted successfully" };
  }

  // ============================================================================================
  // BRAND APIs - General Access
  // ============================================================================================

  // Get all brands for me (brand ownership) -----------------------------------------------------------
  static async getAllBrandsForMe(user_id: string, user_role: RoleType) {
    // If role is ROLES.ADMIN, get access to all brands
    // If role is ROLES.TEAM_LEAD get access to all brands with pod_lead_id = user_id AND brands in User.brands
    // If role is ROLES.TEAM_MEMBER get access to all brands with performancemarketerId = user_id AND brands in User.brands
    // If role is ROLES.CLIENT get access to all brands in User.brands
    const query = brandRepository
      .createQueryBuilder("brand")
      .select([
        "brand.id",
        "brand.name",
        "performanceMarketer.id",
        "performanceMarketer.name",
        "pod.id",
        "pod.name",
        "members.id", // if you want members to be shown + edit leftJoin
        "members.name",
      ])
      .leftJoin("brand.performanceMarketer", "performanceMarketer")
      .leftJoin("brand.pod", "pod")
      .leftJoin("brand.members", "members") // if you want members + edit select
      .orderBy("brand.name", "ASC"); // Sort by name in ascending order

    if (user_role === ROLES.ADMIN) {
      // Admin has access to all brands, no filter needed
    } else if (user_role === ROLES.TEAM_LEAD) {
      query
        .where("brand.pod_lead_id = :user_id", { user_id })
        .orWhere("members.id = :user_id", { user_id });
    } else if (user_role === ROLES.TEAM_MEMBER) {
      query
        .where("brand.performance_marketer_id = :user_id", { user_id })
        .orWhere("members.id = :user_id", { user_id });
    } else if (user_role === ROLES.CLIENT) {
      query.where("members.id = :user_id", { user_id });
    }

    return await query.getMany();
  }
}
