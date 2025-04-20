import axios from '../config/axiosConfig.js';

const handleSummarize = (req, res) => {
    const { text } = req.body;

    if(!req.user) {
        return res.status(404).send('User Not Found');
    }

    if(!text && text.length === 0) {
        return res.status(400).send('Wrong Submission');
    }
    axios.post('/summarize', { text })
        .then(response => {
            const data = response.data;
            return res.status(200).json(data);
        })
        .catch(error => {
            console.log('Error summarising text: ', error);
            return res.status(500).json(error);
        });
};

const handleBulletify = (req, res) => {
    const { text } = req.body;

    if(!req.user) {
        return res.status(404).send('User Not Found');
    }

    if(!text && text.length === 0) {
        return res.status(400).send('Wrong Submission');
    }
    axios.post('/bulletify', { text })
        .then(response => {
            const data = response.data;
            return res.status(200).json(data);
        })
        .catch(error => {
            console.log('Error bulletining text: ', error);
            return res.status(500).json(error);
        });
};

const handleParaphrase = (req, res) => {
    const { text } = req.body;

    if(!req.user) {
        return res.status(404).send('User Not Found');
    }

    if(!text && text.length === 0) {
        return res.status(400).send('Wrong Submission');
    }
    axios.post('/paraphrase', { text })
        .then(response => {
            const data = response.data;
            return res.status(200).json(data);
        })
        .catch(error => {
            console.log('Error paraphrasing text: ', error);
            return res.status(500).json(error);
        });
};

const handleProofread = (req, res) => {
    const { text } = req.body;

    if(!req.user) {
        return res.status(404).send('User Not Found');
    }

    if(!text && text.length === 0) {
        return res.status(400).send('Wrong Submission');
    }
    axios.post('/proofread', { text })
        .then(response => {
            const data = response.data;
            return res.status(200).json(data);
        })
        .catch(error => {
            console.log('Error proofreading text: ', error);
            return res.status(500).json(error);
        });
};

export {
    handleSummarize,
    handleBulletify,
    handleParaphrase,
    handleProofread,
};