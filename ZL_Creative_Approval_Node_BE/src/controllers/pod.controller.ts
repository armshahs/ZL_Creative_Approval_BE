import { Response } from "express";
import { AuthRequest } from "../interfaces";
import { PodService } from "../services";
import { logger, logError } from "../utils";

export class PodController {
  static async createPod(req: AuthRequest, res: Response) {
    const name = req.body.name.trim();
    const pod_leader_id = req.body.pod_leader_id.trim();
    const members = req.body.members;

    try {
      // Call the service method to create a pod
      if (!name || !pod_leader_id || !members) {
        res.status(400).json({ message: "Missing parameters" });
        return;
      }
      const pod = await PodService.createPod(name, pod_leader_id, members);
      res.status(201).json(pod);
    } catch (error) {
      console.error(error);
      const err = error as Error; // Type assertion
      logError(logger, req, err);
      res.status(500).json({ message: err.message });
      return;
    }
  }

  // Get all pods
  static async getAllPods(req: AuthRequest, res: Response) {
    try {
      const pods = await PodService.getAllPods();
      res.status(200).json(pods);
    } catch (error) {
      const err = error as Error; // Type assertion
      logError(logger, req, err);
      res.status(400).json({ message: err.message });
      return;
    }
  }

  // Get a pod by ID
  static async getPodById(req: AuthRequest, res: Response) {
    const { id } = req.params;
    try {
      const pod = await PodService.getPodById(id);
      res.status(200).json(pod);
    } catch (error) {
      const err = error as Error; // Type assertion
      logError(logger, req, err);
      res.status(400).json({ message: err.message });
      return;
    }
  }

  // Update pod details
  static async updatePod(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const name = req.body.name.trim();
    const pod_leader_id = req.body.pod_leader_id.trim();
    const members = req.body.members;
    try {
      const updatedPod = await PodService.updatePod(
        id,
        name,
        pod_leader_id,
        members,
      );
      res.status(200).json(updatedPod);
    } catch (error) {
      const err = error as Error; // Type assertion
      logError(logger, req, err);
      res.status(400).json({ message: err.message });
      return;
    }
  }

  // Delete pod
  static async deletePod(req: AuthRequest, res: Response) {
    try {
      await PodService.deletePod(req.params.id);
      res.status(204).send();
    } catch (error) {
      const err = error as Error; // Type assertion
      logError(logger, req, err);
      res.status(500).json({ message: err.message });
      return;
    }
  }
}
