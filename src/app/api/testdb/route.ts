import { db } from "@/lib/db";

export async function GET() {
  try {
    const result = await db.query("SELECT NOW()");

    return Response.json({
      success: true,
      rows: result.rows,
    });
  } catch (error) {
    console.error("DATABASE ERROR:", error);

    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}