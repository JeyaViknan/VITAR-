import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { message, conversationHistory } = await request.json()

    // Build context from conversation history
    const conversationContext = conversationHistory
      .map((msg: any) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
      .join("\n")

    const systemPrompt = `You are a helpful campus navigation assistant. You help students and visitors navigate the campus, find buildings, get directions, and answer questions about campus facilities and amenities.

You have knowledge about:
- Building locations and purposes
- Campus facilities and services
- Directions and routes between locations
- Campus events and activities
- General campus information

Be friendly, concise, and helpful. If you don't know something, suggest they contact the campus information center.`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      prompt: `${conversationContext}\n\nUser: ${message}\n\nAssistant:`,
      temperature: 0.7,
      maxTokens: 500,
    })

    return Response.json({ response: text.trim() })
  } catch (error) {
    console.error("Chat API error:", error)
    return Response.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
