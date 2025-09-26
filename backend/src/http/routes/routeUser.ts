import { prsm } from "../../utils/prisma";
import { router } from "../../utils/router";

router.get("/:userId/status", async (req, res) => {
  const { userId } = req.params as { userId: string };
  try {
    const response = await prsm.status.findUnique({
      where: {
        userId,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno ao buscar o status." });
  }
});

export default router;
