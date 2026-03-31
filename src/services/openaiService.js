// OpenAI service for generating contextual AI replies
export const generateAIReply = async (emailBody, emailFrom, emailSubject, language = 'en') => {
  const apiKey = process.env.REACT_APP_OPENAI_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const languageMap = {
    en: 'English',
    hi: 'Hindi',
    ta: 'Tamil',
    fr: 'French',
    es: 'Spanish'
  };

  const prompt = `You are a professional email assistant. Generate a concise, professional reply to the following email.

From: ${emailFrom}
Subject: ${emailSubject}

Email Body:
${emailBody}

Generate a brief, professional reply in ${languageMap[language] || 'English'}. Start with an appropriate greeting and keep it concise (2-3 sentences). Do NOT include a closing signature, just the message body.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional email assistant. Generate concise, appropriate email replies.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || 'Unable to generate reply';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};

export const generateAISummary = async (emailBody, language = 'en') => {
  const apiKey = process.env.REACT_APP_OPENAI_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const languageMap = {
    en: 'English',
    hi: 'Hindi',
    ta: 'Tamil',
    fr: 'French',
    es: 'Spanish'
  };

  const prompt = `Summarize the following email in ${languageMap[language] || 'English'}. Include:
- Main topic (1-2 words)
- Key action items (if any)
- Required response (Yes/No)
- Urgency level

Email:
${emailBody}

Provide a concise summary in bullet points.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an email analysis assistant. Provide clear, concise summaries.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || 'Unable to generate summary';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};
