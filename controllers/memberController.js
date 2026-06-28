const User = require('../models/User');

// GET /api/members — Librarian only
const getAllMembers = async (req, res) => {
    try {
        const members = await User.find({ role: 'member' }).select('-password');

        res.status(200).json({
            success: true,
            count: members.length,
            data: members
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/members/:id — Librarian only
const deleteMember = async (req, res) => {
    try {
        const member = await User.findById(req.params.id);

        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        // Prevent deleting a librarian via this route
        if (member.role === 'librarian') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete a librarian account via this route'
            });
        }

        await member.deleteOne();

        res.status(200).json({ success: true, message: 'Member deleted successfully' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllMembers, deleteMember };