import { Request, Response } from 'express';
import { Settings, ISettings } from '../models/Settings';

// Default settings to initialize if none exist
const DEFAULT_SETTINGS = {
    sections: [
        { id: 'hero', title: 'Home', visible: true, order: 1 },
        { id: 'about', title: 'About', visible: true, order: 2 },
        { id: 'skills', title: 'Skills', visible: true, order: 3 },
        { id: 'projects', title: 'Projects', visible: true, order: 4 },
        { id: 'testimonials', title: 'Testimonials', visible: true, order: 5 },
        { id: 'contact', title: 'Contact', visible: true, order: 6 }
    ],
    navigation: [
        { label: 'About', href: '#about', visible: true },
        { label: 'Skills', href: '#skills', visible: true },
        { label: 'Projects', href: '#projects', visible: true },
        { label: 'Testimonials', href: '#testimonials', visible: true },
        { label: 'Contact', href: '#contact', visible: true }
    ]
};

export const getSettings = async (req: Request, res: Response) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create(DEFAULT_SETTINGS);
        }

        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

export const updateSettings = async (req: Request, res: Response) => {
    try {
        const { sections, navigation } = req.body;

        let settings = await Settings.findOne();

        if (!settings) {
            settings = new Settings(DEFAULT_SETTINGS);
        }

        if (sections) settings.sections = sections;
        if (navigation) settings.navigation = navigation;
        settings.updatedAt = new Date();

        await settings.save();

        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
