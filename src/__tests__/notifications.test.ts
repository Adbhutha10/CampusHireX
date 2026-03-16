import { vi, describe, it, expect, beforeEach } from 'vitest'
import { createNotification } from '../backend/lib/notifications'
import { prisma } from '../backend/lib/prisma'
import { resend } from '../backend/lib/resend'

vi.mock('../backend/lib/prisma', () => ({
  prisma: {
    notification: {
      create: vi.fn(),
    },
  },
}))

vi.mock('../backend/lib/resend', () => ({
  resend: {
    emails: {
      send: vi.fn(),
    },
  },
  SENDER_EMAIL: 'onboarding@resend.dev',
}))

describe('createNotification', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a database notification', async () => {
    const mockNotification = { id: '1', userId: 'user1', title: 'Test', message: 'Hello', type: 'system' }
    vi.mocked(prisma.notification.create).mockResolvedValue(mockNotification as any)

    const result = await createNotification('user1', 'Test', 'Hello', 'system')

    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: {
        userId: 'user1',
        title: 'Test',
        message: 'Hello',
        type: 'system',
      },
    })
    expect(result).toEqual(mockNotification)
  })

  it('sends an email if emailData is provided and API key exists', async () => {
    process.env.RESEND_API_KEY = 're_test'
    const mockNotification = { id: '1' }
    vi.mocked(prisma.notification.create).mockResolvedValue(mockNotification as any)
    vi.mocked(resend.emails.send).mockResolvedValue({ id: 'email1' } as any)

    await createNotification('user1', 'Test', 'Hello', 'system', {
      studentName: 'John',
      companyName: 'Google',
      status: 'SELECTED',
      email: 'john@example.com',
    })

    expect(resend.emails.send).toHaveBeenCalled()
  })
})
