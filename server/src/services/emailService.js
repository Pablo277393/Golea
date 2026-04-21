/**
 * Email Service Placeholder
 * In a production app, this would integrate with SendGrid, SMTP, etc.
 */
const emailService = {
  /**
   * Sends a notification to a user who hit the triple challenge.
   */
  sendWinningNotification: async (userEmail, comboInfo, prize) => {
    console.log(`[EMAIL SERVICE] Sending congratulations to ${userEmail}`);
    console.log(`[EMAIL SERVICE] Message: ¡Felicidades! Has acertado el Triple Desafío de Golea.`);
    console.log(`[EMAIL SERVICE] Prize: ${prize.description} por cortesía de ${prize.sponsor_name}`);
    
    // Logic for sending email would go here
    return true;
  }
};

module.exports = emailService;
