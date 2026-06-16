import { In } from "typeorm";
import { AppDataSource } from "../database";
import { User, Pod } from "../models";
import { ROLES, pod_selection } from "../config";
import { updateAllBrandsForPod } from "../utils";

const podRepository = AppDataSource.getRepository(Pod);
const userRepository = AppDataSource.getRepository(User);

export class PodService {
  static async createPod(
    name: string,
    pod_leader_id: string,
    members: string[] = [],
  ) {
    // Check if the pod leader exists
    const podLeader = await userRepository.findOne({
      where: { id: pod_leader_id },
      select: ["id", "email", "name", "role"],
    });
    if (!podLeader) {
      throw new Error("Pod Leader not found");
    }
    // If a member is assigned as a team lead, change role to team lead. But if they are admin, do not change.
    if (podLeader.role === ROLES.TEAM_MEMBER) {
      podLeader.role = ROLES.TEAM_LEAD;
      await userRepository.save(podLeader); // Save the updated pod leader role in the DB
    }

    // Ensure the pod leader is included in the members list if it's not already there
    if (!members.includes(pod_leader_id)) {
      members.push(pod_leader_id);
    }

    // Check if all members exist
    let users: User[] = [];
    if (members.length > 0) {
      users = await userRepository.find({
        where: { id: In(members) },
        select: ["id", "email", "name", "role"],
      });

      // Find which members are missing
      const foundUserIds = users.map((user) => user.id);
      const missingMembers = members.filter(
        (memberId) => !foundUserIds.includes(memberId),
      );

      // If there are missing members, throw an error with the list of missing members
      if (missingMembers.length > 0) {
        throw new Error(`Members not found: ${missingMembers.join(", ")}`);
      }
    }

    // Create new pod
    const pod = new Pod();
    pod.name = name;
    pod.podLeader = podLeader;
    pod.members = users;

    // Save the pod to the database
    const savedPod = await podRepository.save(pod);

    // Perform a bulk update on the brands, setting the pod and podLead fields
    // updateBrandsForPod(members, savedPod, podLeader);
    updateAllBrandsForPod();

    return savedPod;
  }

  // Get all pods------------------------------------------
  static async getAllPods() {
    return await podRepository.find({
      relations: ["podLeader", "members"],
      select: pod_selection,
      order: { name: "ASC" }, // Sort pods by name in ascending order
    });
  }

  // Get a pod by ID-----------------------------------------
  static async getPodById(id: string) {
    const pod = await podRepository.findOne({
      where: { id },
      relations: ["podLeader", "members"],
      select: pod_selection,
    });
    if (!pod) {
      throw new Error("Pod not found");
    }
    return pod;
  }

  // Update pod details OPTIMIZED CODE -------------------------------------
  static async updatePod(
    id: string,
    name: string,
    pod_leader_id: string,
    members: string[],
  ) {
    if (!id || !name || !pod_leader_id || !members) {
      throw new Error("Request body or request parameter fields missing");
    }

    // Fetch the pod first
    const pod = await podRepository
      .createQueryBuilder("pod")
      .leftJoinAndSelect("pod.podLeader", "podLeader")
      .select(["pod.id", "pod.name", "podLeader.id"]) // Only fetch necessary fields
      .where("pod.id = :id", { id })
      .getOne();

    if (!pod || !pod.podLeader) {
      throw new Error("Pod or Pod Leader not found");
    }

    // Fetch previous pod leader and new pod leader concurrently
    const leaders = await userRepository.find({
      where: { id: In([pod?.podLeader?.id, pod_leader_id]) }, // Fetch both at once
      select: ["id", "email", "name", "role"], // Fetch minimal data
    });

    const prevPodLeader = leaders.find(
      (user) => user.id === pod?.podLeader?.id,
    );
    const newPodLeader = leaders.find((user) => user.id === pod_leader_id);

    if (!prevPodLeader) throw new Error("Previous Pod Leader not found");
    if (!newPodLeader) throw new Error("New Pod Leader not found");

    // Update pod name
    pod.name = name;

    // Update previous pod leader role if necessary
    if (prevPodLeader.role === ROLES.TEAM_LEAD) {
      prevPodLeader.role = ROLES.TEAM_MEMBER;
    }

    // Assign new pod leader and update role if necessary
    pod.podLeader = newPodLeader;
    if (newPodLeader.role === ROLES.TEAM_MEMBER) {
      newPodLeader.role = ROLES.TEAM_LEAD;
    }

    // Ensure the new pod leader is included in the members list
    if (!members.includes(pod_leader_id)) {
      members.push(pod_leader_id);
    }

    // Fetch members concurrently
    const foundUsers = await userRepository
      .createQueryBuilder("user")
      .select(["user.id", "user.email", "user.name", "user.role"]) // Select minimal data
      .where("user.id IN (:...members)", { members }) // Filter by ids in the members list
      .getMany();

    pod.members = foundUsers;

    // Save all updates in one DB call. Tried promise.all but it was taking more time.
    await AppDataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save([prevPodLeader, newPodLeader, pod]); // Batch save
    });

    // Perform a bulk update on the brands, setting the pod and podLead fields
    // updateBrandsForPod(members, pod, newPodLeader);
    updateAllBrandsForPod();

    return pod;
  }

  // Delete pod ---------------------------------------------
  static async deletePod(id: string) {
    const pod = await podRepository.delete(id);
    updateAllBrandsForPod();
    return pod;
  }
}
