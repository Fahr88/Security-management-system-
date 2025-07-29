// ملف: app.js

// 1. تهيئة EmailJS بمعرفك العام
emailjs.init("0aUYJJifqvNa6UxYp");

/**
 * 2. دالة مركزية لإرسال أي نموذج كملف PDF عبر البريد الإلكتروني
 */
function sendEmailWithPDF(options) {
  const { formId, emailInputId, pdfFileName, formTitle, templateId, serviceId } = options;

  const userEmail = document.getElementById(emailInputId).value;
  if (!userEmail) {
    alert("يرجى إدخال البريد الإلكتروني للمستلم أولاً.");
    return;
  }

  const sendButton = event.target;
  sendButton.disabled = true;
  sendButton.innerText = "الرجاء الانتظار، جارٍ الإرسال...";

  const formElement = document.getElementById(formId);

  const pdfOptions = {
    margin: 0.5,
    filename: pdfFileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().from(formElement).set(pdfOptions).outputPdf('blob').then(function(pdfBlob) {
    const templateParams = {
      to_email: userEmail,
      form_title: formTitle,
    };

    emailjs.send(serviceId, templateId, templateParams, {
      attachment: new File([pdfBlob], pdfFileName, { type: "application/pdf" })
    })
    .then(() => {
      alert(`✅ تم إرسال التقرير بنجاح إلى ${userEmail}`);
      sendButton.disabled = false;
      sendButton.innerText = sendButton.dataset.originalText || "إرسال بالبريد";
    })
    .catch(err => {
      console.error('فشل إرسال البريد:', err);
      alert(`❌ حدث خطأ أثناء إرسال البريد. يرجى مراجعة الـ Console.`);
      sendButton.disabled = false;
      sendButton.innerText = sendButton.dataset.originalText || "إرسال بالبريد";
    });
  });
}

/**
 * دالة لتصدير PDF فقط (بدون إرسال)
 */
function exportAsPDF(formId, pdfFileName) {
    const formElement = document.getElementById(formId);
    const pdfOptions = {
        margin: 0.5,
        filename: pdfFileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(formElement).set(pdfOptions).save();
}

/**
 * دالة للرجوع للصفحة الرئيسية
 */
function goBack() {
  window.location.href = "index.html";
}
