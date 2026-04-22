/**
 * Generates a unique linking code in the format: PREFIX-XXXX-XXXX
 */
const generateLinkingCode = (prefix = 'JUG') => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const segment = (len) => {
    let result = '';
    for (let i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  return `${prefix}-${segment(4)}-${segment(4)}`;
};

module.exports = { generateLinkingCode };
