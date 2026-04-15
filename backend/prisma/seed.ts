import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@unifiedac.ai' },
    update: {},
    create: {
      email: 'demo@unifiedac.ai',
      firstName: 'Demo',
      lastName: 'User',
      role: 'ADMIN',
      passwordHash: '$2b$10$demo.hash.replace.in.real.environment',
    },
  });

  const departments = await Promise.all([
    prisma.department.upsert({
      where: { code: 'FIN' },
      update: {},
      create: {
        name: 'Finance',
        code: 'FIN',
        ownerId: demoUser.id,
      },
    }),
    prisma.department.upsert({
      where: { code: 'OPS' },
      update: {},
      create: {
        name: 'Operations',
        code: 'OPS',
        ownerId: demoUser.id,
      },
    }),
    prisma.department.upsert({
      where: { code: 'HR' },
      update: {},
      create: {
        name: 'Human Resources',
        code: 'HR',
        ownerId: demoUser.id,
      },
    }),
  ]);

  const audit = await prisma.audit.create({
    data: {
      title: 'Q2 Operational Efficiency Baseline',
      status: 'IN_PROGRESS',
      createdById: demoUser.id,
      summary:
        'Baseline review covering workflow health, risk posture, and AI opportunity discovery across core departments.',
      scopeDepartments: departments.map((d) => d.id),
      startedAt: new Date('2026-04-01T09:00:00.000Z'),
    },
  });

  const workflows = await Promise.all([
    prisma.workflow.create({
      data: {
        auditId: audit.id,
        departmentId: departments[0].id,
        name: 'Invoice Processing',
        description: 'End-to-end AP invoice intake, coding, approvals, and payment scheduling.',
        automationLevel: 42,
        tasks: {
          create: [
            {
              name: 'Capture invoice from email/PDF',
              ownerRole: 'AP_SPECIALIST',
              status: 'DONE',
              cycleTimeHours: 4,
            },
            {
              name: 'Validate coding + cost center',
              ownerRole: 'FINANCE_ANALYST',
              status: 'IN_PROGRESS',
              cycleTimeHours: 6,
            },
            {
              name: 'Manager approval routing',
              ownerRole: 'DEPARTMENT_MANAGER',
              status: 'BLOCKED',
              cycleTimeHours: 18,
            },
          ],
        },
      },
    }),
    prisma.workflow.create({
      data: {
        auditId: audit.id,
        departmentId: departments[1].id,
        name: 'Incident Escalation',
        description: 'Operational incident triage, handoff, and SLA closure workflow.',
        automationLevel: 35,
        tasks: {
          create: [
            {
              name: 'Classify incident severity',
              ownerRole: 'NOC_ANALYST',
              status: 'DONE',
              cycleTimeHours: 1,
            },
            {
              name: 'Assign resolver team',
              ownerRole: 'OPERATIONS_LEAD',
              status: 'IN_PROGRESS',
              cycleTimeHours: 2,
            },
            {
              name: 'Customer status update',
              ownerRole: 'SUPPORT_MANAGER',
              status: 'TODO',
              cycleTimeHours: 3,
            },
          ],
        },
      },
    }),
    prisma.workflow.create({
      data: {
        auditId: audit.id,
        departmentId: departments[2].id,
        name: 'New Hire Onboarding',
        description: 'Cross-functional onboarding from offer acceptance to week-one readiness.',
        automationLevel: 51,
        tasks: {
          create: [
            {
              name: 'Provision accounts and hardware',
              ownerRole: 'IT_ADMIN',
              status: 'IN_PROGRESS',
              cycleTimeHours: 10,
            },
            {
              name: 'Policy acknowledgements',
              ownerRole: 'HR_GENERALIST',
              status: 'TODO',
              cycleTimeHours: 6,
            },
            {
              name: 'Manager kickoff checklist',
              ownerRole: 'PEOPLE_MANAGER',
              status: 'TODO',
              cycleTimeHours: 5,
            },
          ],
        },
      },
    }),
  ]);

  const painPoints = [
    {
      title: 'Manual invoice data entry',
      severity: 5,
      frequencyPerWeek: 38,
      departmentId: departments[0].id,
      workflowId: workflows[0].id,
    },
    {
      title: 'Approval bottlenecks during PTO periods',
      severity: 4,
      frequencyPerWeek: 16,
      departmentId: departments[0].id,
      workflowId: workflows[0].id,
    },
    {
      title: 'Inconsistent incident severity labeling',
      severity: 4,
      frequencyPerWeek: 21,
      departmentId: departments[1].id,
      workflowId: workflows[1].id,
    },
    {
      title: 'Duplicate ticket updates across tools',
      severity: 3,
      frequencyPerWeek: 44,
      departmentId: departments[1].id,
      workflowId: workflows[1].id,
    },
    {
      title: 'Delayed hardware provisioning',
      severity: 5,
      frequencyPerWeek: 7,
      departmentId: departments[2].id,
      workflowId: workflows[2].id,
    },
    {
      title: 'Missed compliance training reminders',
      severity: 3,
      frequencyPerWeek: 12,
      departmentId: departments[2].id,
      workflowId: workflows[2].id,
    },
    {
      title: 'No standardized manager onboarding handoff',
      severity: 4,
      frequencyPerWeek: 9,
      departmentId: departments[2].id,
      workflowId: workflows[2].id,
    },
  ];

  await prisma.painPoint.createMany({ data: painPoints });

  await prisma.opportunityScore.createMany({
    data: [
      {
        auditId: audit.id,
        departmentId: departments[0].id,
        category: 'AP_AUTOMATION',
        score: 88,
        confidence: 0.91,
        estimatedSavingsUsd: 124000,
      },
      {
        auditId: audit.id,
        departmentId: departments[1].id,
        category: 'INCIDENT_ASSIST',
        score: 79,
        confidence: 0.86,
        estimatedSavingsUsd: 91000,
      },
      {
        auditId: audit.id,
        departmentId: departments[2].id,
        category: 'ONBOARDING_COPILOT',
        score: 84,
        confidence: 0.89,
        estimatedSavingsUsd: 76000,
      },
    ],
  });

  await prisma.aiRecommendation.createMany({
    data: [
      {
        auditId: audit.id,
        title: 'Deploy invoice OCR + coding suggestion model',
        description:
          'Automatically extract invoice fields and suggest GL coding with human-in-the-loop validation.',
        impactLevel: 'HIGH',
        effortLevel: 'MEDIUM',
      },
      {
        auditId: audit.id,
        title: 'Add incident triage assistant',
        description:
          'Use historical incident patterns to recommend severity and owner routing during triage.',
        impactLevel: 'MEDIUM',
        effortLevel: 'LOW',
      },
      {
        auditId: audit.id,
        title: 'Create onboarding orchestration agent',
        description:
          'Generate personalized onboarding plans and automate reminder nudges across IT/HR managers.',
        impactLevel: 'HIGH',
        effortLevel: 'MEDIUM',
      },
    ],
  });

  await prisma.governanceRisk.createMany({
    data: [
      {
        auditId: audit.id,
        riskCode: 'DATA-001',
        title: 'PII leakage in prompt payloads',
        severity: 'HIGH',
        mitigation: 'Implement field-level redaction and prompt linting at API gateway.',
      },
      {
        auditId: audit.id,
        riskCode: 'MODEL-002',
        title: 'Model drift impacting recommendation quality',
        severity: 'MEDIUM',
        mitigation: 'Schedule quarterly evaluation benchmarks with rollback thresholds.',
      },
      {
        auditId: audit.id,
        riskCode: 'ACCESS-003',
        title: 'Over-privileged service tokens',
        severity: 'HIGH',
        mitigation: 'Use scoped secrets and rotate tokens every 30 days.',
      },
    ],
  });

  await prisma.reportSection.createMany({
    data: [
      {
        auditId: audit.id,
        key: 'executive_summary',
        heading: 'Executive Summary',
        body: 'Top opportunities are invoice automation and onboarding orchestration with strong projected ROI.',
        sortOrder: 1,
      },
      {
        auditId: audit.id,
        key: 'methodology',
        heading: 'Methodology',
        body: 'Mixed-method review using process walkthroughs, task metadata, and stakeholder interviews.',
        sortOrder: 2,
      },
      {
        auditId: audit.id,
        key: 'risk_register',
        heading: 'Governance Risk Register',
        body: 'Three high-priority risks identified across data handling, model reliability, and identity controls.',
        sortOrder: 3,
      },
      {
        auditId: audit.id,
        key: 'recommendations',
        heading: 'AI Recommendations',
        body: 'Prioritized roadmap balances impact and implementation effort across departments.',
        sortOrder: 4,
      },
    ],
  });

  console.log(`Seed complete for audit ${audit.id} with demo user ${demoUser.email}`);
}

main()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
