using System.Net;
using System.Net.Mail;
using BE.Private;

namespace BE.Services;

public class EmailSender : IEmailSender
{
    private readonly EmailInfo _emailInfo;

    public EmailSender(EmailInfo emailInfo) {
        _emailInfo = emailInfo;
    }
    
    public Task SendEmailAsync(string email, string subject, string message)
    {
        var mail = _emailInfo.username;
        var password = _emailInfo.password;

        var client = new SmtpClient("smtp.gmail.com", 587) {
            EnableSsl = true,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(mail, password)
        };

        return client.SendMailAsync(
            new MailMessage(from: mail,
                            to: email,
                            subject,
                            message)
        );
    }
}