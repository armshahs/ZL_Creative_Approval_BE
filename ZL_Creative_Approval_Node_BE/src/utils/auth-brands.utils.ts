import { Brand, Pod, User } from "../models";
import { AppDataSource } from "../database";

const brandRepository = AppDataSource.getRepository(Brand);

// use this function to update the brand table pod_id and pod_lead_id for selected members
// To be called for any CUD operations on Pods (except Read)
export async function updateBrandsForPod(
  members: string[], // List of members (User entities)
  savedPod: Pod, // The pod object
  podLeader: User, // The pod leader (User entity)
) {
  // Perform the bulk update
  await brandRepository
    .createQueryBuilder()
    .update(Brand)
    .set({
      pod: savedPod,
      podLead: podLeader,
    })
    .where("performanceMarketer IN (:...memberIds)", { memberIds: members })
    .execute(); // Executes the update query
}

// updates all brands with the new pod and podLeader details
export async function updateAllBrandsForPod() {
  // Fetch all brands with their performanceMarketer, pod, and podLead
  const brands = await brandRepository.find({
    relations: [
      "performanceMarketer",
      "performanceMarketer.pod",
      "performanceMarketer.pod.podLeader",
    ], // Include relations
  });

  // Map through the brands and prepare updates
  const updatePromises = brands.map(async (brand) => {
    const performanceMarketer = brand.performanceMarketer;

    if (performanceMarketer) {
      // Assign the performanceMarketer, pod, and podLead to the brand
      const pod = performanceMarketer.pod ?? null;
      const podLead = pod?.podLeader ?? null;

      brand.performanceMarketer = performanceMarketer;
      brand.pod = pod;
      brand.podLead = podLead;

      // Save the updated brand
      await brandRepository.save(brand);
    }
  });

  // Execute all updates concurrently
  await Promise.all(updatePromises);

  return brands; // Return the updated list of brands
}
