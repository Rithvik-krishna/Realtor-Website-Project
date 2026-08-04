import { Router } from 'express';
import authRoutes from '../../modules/auth/auth.routes.js';
import propertyRoutes from '../../modules/properties/property.routes.js';
import searchRoutes from '../../modules/search/search.routes.js';
import aiRoutes from '../../modules/ai/ai.routes.js';
import sellerRoutes from '../../modules/seller/seller.routes.js';
import buyerRoutes from '../../modules/buyer/buyer.routes.js';
import appointmentRoutes from '../../modules/appointments/appointment.routes.js';
import adminRoutes from '../../modules/admin/admin.routes.js';
import analyticsRoutes from '../../modules/analytics/analytics.routes.js';
import trrebRoutes from '../../modules/integrations/trreb.routes.js';
import onboardingRoutes from '../../modules/onboarding/onboarding.routes.js';

const v1Router = Router();

v1Router.use('/auth', authRoutes);
v1Router.use('/properties', propertyRoutes);
v1Router.use('/search', searchRoutes);
v1Router.use('/ai', aiRoutes);
v1Router.use('/seller', sellerRoutes);
v1Router.use('/buyer', buyerRoutes);
v1Router.use('/appointments', appointmentRoutes);
v1Router.use('/admin', adminRoutes);
v1Router.use('/analytics', analyticsRoutes);
v1Router.use('/integrations/trreb', trrebRoutes);
v1Router.use('/onboarding', onboardingRoutes);

export default v1Router;
