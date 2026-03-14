const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function verifyWorkflow() {
    console.log("🚀 Starting End-to-End Payment Workflow Verification...");

    try {
        // 1. Setup: Get a valid cohort and program
        const cohortProgram = await prisma.cohort_programs.findFirst({
            include: { program: true, cohort: true }
        });

        if (!cohortProgram) {
            console.error("❌ No cohort_programs found. Please seed the database first.");
            return;
        }

        const { cohort_id, program_id } = cohortProgram;
        console.log(`📍 Testing with Program: ${cohortProgram.program.name}, Cohort: ${cohortProgram.cohort.name}`);

        // 2. Simulate Enrollment Creation (Step 4 of Form)
        console.log("📝 Simulating Enrollment Creation...");
        const enrollResponse = await fetch('http://localhost:3000/api/enrollments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cohort_id,
                program_id,
                full_name: "Test Student Verification",
                email: `test-${Date.now()}@example.com`,
                phone: "08012345678",
                country: "Nigeria",
                city: "Lagos",
                payment_method: "bank"
            })
        });

        const enrollData = await enrollResponse.json();
        if (!enrollResponse.ok) throw new Error(`Enrollment Failed: ${enrollData.error} - Details: ${enrollData.details || 'None'}`);

        const enrollmentId = enrollData.id;
        console.log(`✅ Enrollment Created! ID: ${enrollmentId}`);
        console.log(`📊 Initial Status: Payment=${enrollData.payment_status}, Approval=${enrollData.approval_status}`);

        // 3. Verify Statuses are Correct (Uppercase)
        if (enrollData.payment_status !== 'PENDING' || enrollData.approval_status !== 'PENDING_PAYMENT') {
            throw new Error(`❌ Invalid Initial States: ${enrollData.payment_status}/${enrollData.approval_status}`);
        }
        console.log("✅ Initial States Validated (PENDING / PENDING_PAYMENT)");

        // 4. Simulate Student "Mark as Paid" (Bank Transfer)
        console.log("🏦 Simulating Student 'Mark as Paid'...");
        const verifyRes = await fetch('http://localhost:3000/api/enrollments/verify-transfer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                enrollmentId,
                reference: `VERIFY-${enrollmentId.slice(0, 8).toUpperCase()}`
            })
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) throw new Error(`Transfer Verification Failed: ${verifyData.error}`);
        console.log(`✅ Transfer Marked! New Status: Payment=${verifyData.payment_status}, Approval=${verifyData.approval_status}`);

        if (verifyData.payment_status !== 'AWAITING_VERIFICATION' || verifyData.approval_status !== 'AWAITING_VERIFICATION') {
            throw new Error(`❌ Invalid Verification States: ${verifyData.payment_status}/${verifyData.approval_status}`);
        }
        console.log("✅ Verification States Validated (AWAITING_VERIFICATION)");

        // 5. Simulate Admin Approval (Dashboard Action)
        console.log("🛡️ Simulating Admin Approval...");
        const approveRes = await fetch('http://localhost:3000/api/admin/admissions', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: enrollmentId,
                payment_status: 'PAID',
                approval_status: 'APPROVED'
            })
        });

        const approveData = await approveRes.json();
        if (!approveRes.ok) throw new Error(`Admin Approval Failed: ${approveData.error}`);
        console.log(`✅ Admin Approved! Final Status: Payment=${approveData.payment_status}, Approval=${approveData.approval_status}`);

        if (approveData.payment_status !== 'PAID' || approveData.approval_status !== 'APPROVED') {
            throw new Error(`❌ Invalid Final States: ${approveData.payment_status}/${approveData.approval_status}`);
        }
        console.log("✅ Final States Validated (PAID / APPROVED)");

        console.log("\n✨ Verification Complete! The end-to-end payment workflow is fully functional.");

    } catch (err) {
        console.error(`\n❌ Verification Blocked: ${err.message}`);
    } finally {
        await prisma.$disconnect();
    }
}

verifyWorkflow();
