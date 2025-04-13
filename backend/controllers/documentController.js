import db from '../config/knex.js';
const getDocuments = async (req, res) => {
  try {
    // We assume Passport attaches the user object on req
    const userId = req.user.user_id;
    if (!userId) {
      return res.status(400).json({ error: 'User ID not found.' });
    }

    // Query the database for the user's documents
    const documents = await db('documents')
      .select('document_id', 'title', 'updated_at')
      .where({ user_id: userId })
      .orderBy('updated_at', 'desc');

    return res.status(200).json({ documents });
  } catch (error) {
    console.error('Error fetching dashboard documents:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
export default {getDocuments}