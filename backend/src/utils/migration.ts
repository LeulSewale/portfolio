import { connectDatabase } from '../config/database';
import { Profile } from '../models/Profile';
import { Project } from '../models/Project';
import { SkillCategory } from '../models/SkillCategory';
import { Testimonial } from '../models/Testimonial';
import { AdminUser } from '../models/AdminUser';
import { config } from '../config/env';
import * as fs from 'fs';
import * as path from 'path';

const CONTENT_JSON_PATH = path.join(__dirname, '../../..', 'data/content.json');

interface ContentJSON {
    profile: any;
    skillCategories: any[];
    projects: any[];
    testimonials: any[];
}

async function migrate() {
    try {
        // Connect to database
        await connectDatabase();
        console.log('\n🔄 Starting data migration...\n');

        // Read existing content.json
        const content: ContentJSON = JSON.parse(fs.readFileSync(CONTENT_JSON_PATH, 'utf-8'));

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Promise.all([
            Profile.deleteMany({}),
            Project.deleteMany({}),
            SkillCategory.deleteMany({}),
            Testimonial.deleteMany({}),
            AdminUser.deleteMany({}),
        ]);

        // Migrate Profile
        console.log('👤 Migrating profile data...');
        const profile = new Profile(content.profile);
        await profile.save();
        console.log(`✅ Profile migrated: ${profile.name}`);

        // Migrate Projects
        console.log('\n📁 Migrating projects...');
        for (const projectData of content.projects) {
            const project = new Project({
                ...projectData,
                isActive: projectData.visible,
                featured: projectData.featured || false,
            });
            await project.save();
            console.log(`✅ Project migrated: ${project.title}`);
        }

        // Migrate Skills
        console.log('\n💻 Migrating skills...');
        for (const skillData of content.skillCategories) {
            const skill = new SkillCategory({
                ...skillData,
                categoryId: skillData.id, // map id from content.json to required categoryId
                isActive: skillData.visible,
            });
            await skill.save();
            console.log(`✅ Skill category migrated: ${skill.title}`);
        }

        // Migrate Testimonials
        console.log('\n💬 Migrating testimonials...');
        for (const testimonialData of content.testimonials) {
            const testimonial = new Testimonial({
                ...testimonialData,
                isActive: testimonialData.visible,
            });
            await testimonial.save();
            console.log(`✅ Testimonial migrated: ${testimonial.name}`);
        }

        // Create admin user
        console.log('\n🔐 Creating admin user...');
        const adminUser = new AdminUser({
            username: config.adminCredentials.username,
            password: config.adminCredentials.password,
            email: config.adminCredentials.email,
            role: 'admin',
        });
        await adminUser.save();
        console.log(`✅ Admin user created: ${adminUser.username}`);

        // Summary
        console.log('\n📊 Migration Summary:');
        console.log(`   Profile: 1 migrated`);
        console.log(`   Projects: ${await Project.countDocuments()} migrated`);
        console.log(`   Skills: ${await SkillCategory.countDocuments()} categories migrated`);
        console.log(`   Testimonials: ${await Testimonial.countDocuments()} migrated`);
        console.log(`   Admin Users: ${await AdminUser.countDocuments()} created`);

        console.log('\n✨ Migration completed successfully!\n');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
migrate();
