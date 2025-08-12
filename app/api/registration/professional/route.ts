import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { z } from "zod"

const registerProfessionalSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 caracteres"),
  profession: z.string().min(1, "La profesión es requerida"),
  experience: z.string().min(1, "La experiencia es requerida"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  location: z.string().min(1, "La ubicación es requerida"),
  zone: z.string().min(1, "La zona es requerida"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerProfessionalSchema.parse(body)
    
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { message: "El email ya está registrado" },
        { status: 400 }
      )
    }
    
    const experienceYears = parseInt(validatedData.experience)
    
    const user = await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        userType: "PROFESSIONAL",
      }
    })
    
    const professionalProfile = await db.professionalProfile.create({
      data: {
        userId: user.id,
        profession: validatedData.profession,
        description: validatedData.description,
        experience: experienceYears,
        location: validatedData.location,
        zone: validatedData.zone,
        available: true,
      }
    })
    
    return NextResponse.json({
      message: "Profesional registrado exitosamente",
      userId: user.id,
      professionalProfileId: professionalProfile.id
    })
    
  } catch (error) {
    console.error("Error en registro de profesional:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Datos inválidos", errors: error.issues },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    )
  }
}