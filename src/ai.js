const OpenAI = require('openai');
const openai = new OpenAI(process.env.OPENAI_API_KEY);

const categorizeEmail = async (emailContent) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
        { 
            role: 'system', 
            content: 'You are an intelligent assistant that categorizes emails based on their content. You classify emails into one of three categories: Interested, Not Interested, or More Information.'
          },
          
          { 
            role: 'user', 
            content: `Here is an email: "${emailContent}". Please analyze the content and classify the email into one of the following categories:
            Interested
            Not Interested
            More Information`
          }
          
    ]
  });
  return response.choices[0].message.content.trim();
};

const generateResponse = async (emailContent, category) => {

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
        {
            role: 'system',
            content: 'You are an intelligent assistant that writes emails based on their content and category. My name is Chaithanya K. The output from the chat is directly fed to the email'
          },
          
          {
            role: 'user',
            content: `Based on the category "${category}", generate a response for the following email content: ${emailContent}`
          }
          
          
    ]
  });

  return response.choices[0].message.content.trim();
};

module.exports = { categorizeEmail, generateResponse };
