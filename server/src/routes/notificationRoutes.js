import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { 
    getUserNotifications, 
    markNotificationsAsRead, 
    getUnreadCount 
} from '../controllers/notificationController.js';

const router = Router();

router.get('/:userId', requireAuth(['caretaker', 'patient', 'admin']), getUserNotifications);

router.get('/unread/:userId', requireAuth(['caretaker', 'patient', 'admin']), getUnreadCount);

router.patch('/read/:userId', requireAuth(['caretaker', 'patient', 'admin']), markNotificationsAsRead);

export default router;