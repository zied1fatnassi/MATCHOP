import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Export profile to PDF
 */
export async function exportProfileToPDF(profile, experiences, education, certifications) {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    let yPos = 20

    // Title
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.text(profile.display_name || 'Student Profile', pageWidth / 2, yPos, { align: 'center' })

    yPos += 10

    // Contact Info
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(profile.location || '', pageWidth / 2, yPos, { align: 'center' })

    yPos += 15

    // Bio
    if (profile.bio) {
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('About', 20, yPos)
        yPos += 7

        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        const bioLines = pdf.splitTextToSize(profile.bio, pageWidth - 40)
        pdf.text(bioLines, 20, yPos)
        yPos += bioLines.length * 5 + 10
    }

    // Skills
    if (profile.skills && profile.skills.length > 0) {
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Skills', 20, yPos)
        yPos += 7

        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'normal')
        pdf.text(profile.skills.join(' • '), 20, yPos)
        yPos += 10
    }

    // Experience
    if (experiences && experiences.length > 0) {
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Experience', 20, yPos)
        yPos += 7

        experiences.forEach(exp => {
            if (yPos > 270) {
                pdf.addPage()
                yPos = 20
            }

            pdf.setFontSize(11)
            pdf.setFont('helvetica', 'bold')
            pdf.text(exp.job_title, 20, yPos)
            yPos += 5

            pdf.setFontSize(10)
            pdf.setFont('helvetica', 'normal')
            pdf.text(exp.company, 20, yPos)
            yPos += 5

            const dateText = `${exp.start_date} - ${exp.is_current ? 'Present' : exp.end_date || 'N/A'}`
            pdf.text(dateText, 20, yPos)
            yPos += 5

            if (exp.description) {
                const descLines = pdf.splitTextToSize(exp.description, pageWidth - 40)
                pdf.text(descLines, 20, yPos)
                yPos += descLines.length * 5
            }

            yPos += 8
        })
    }

    // Education
    if (education && education.length > 0) {
        if (yPos > 250) {
            pdf.addPage()
            yPos = 20
        }

        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Education', 20, yPos)
        yPos += 7

        education.forEach(edu => {
            if (yPos > 270) {
                pdf.addPage()
                yPos = 20
            }

            pdf.setFontSize(11)
            pdf.setFont('helvetica', 'bold')
            pdf.text(`${edu.degree} - ${edu.field_of_study || ''}`, 20, yPos)
            yPos += 5

            pdf.setFontSize(10)
            pdf.setFont('helvetica', 'normal')
            pdf.text(edu.institution, 20, yPos)
            yPos += 5

            const dateText = `${edu.start_date} - ${edu.is_current ? 'Present' : edu.end_date || 'N/A'}`
            pdf.text(dateText, 20, yPos)
            yPos += 8
        })
    }

    // Certifications
    if (certifications && certifications.length > 0) {
        if (yPos > 250) {
            pdf.addPage()
            yPos = 20
        }

        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'bold')
        pdf.text('Certifications', 20, yPos)
        yPos += 7

        certifications.forEach(cert => {
            if (yPos > 270) {
                pdf.addPage()
                yPos = 20
            }

            pdf.setFontSize(11)
            pdf.setFont('helvetica', 'bold')
            pdf.text(cert.name, 20, yPos)
            yPos += 5

            pdf.setFontSize(10)
            pdf.setFont('helvetica', 'normal')
            pdf.text(cert.issuing_organization, 20, yPos)
            yPos += 5

            pdf.text(`Issued: ${cert.issue_date}`, 20, yPos)
            yPos += 8
        })
    }

    // Save
    pdf.save(`${profile.display_name || 'profile'}_CV.pdf`)
}

/**
 * Generate profile share link
 */
export function generateProfileShareLink(userId) {
    const baseUrl = window.location.origin
    return `${baseUrl}/profile/${userId}`
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text)
        return { success: true }
    } catch (err) {
        return { success: false, error: err.message }
    }
}

export default {
    exportProfileToPDF,
    generateProfileShareLink,
    copyToClipboard
}
