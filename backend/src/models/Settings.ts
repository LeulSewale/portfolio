import mongoose, { Schema, Document } from 'mongoose';

export interface ISectionConfig {
  id: string;
  title: string;
  visible: boolean;
  order: number;
}

export interface INavigationItem {
  label: string;
  href: string;
  visible: boolean;
}

export interface ISettings extends Document {
  sections: ISectionConfig[];
  navigation: INavigationItem[];
  updatedAt: Date;
}

const sectionConfigSchema = new Schema({
  id: { type: String, required: true }, // e.g., 'hero', 'about'
  title: { type: String, required: true },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { _id: false });

const navigationItemSchema = new Schema({
  label: { type: String, required: true },
  href: { type: String, required: true },
  visible: { type: Boolean, default: true }
}, { _id: false });

const settingsSchema = new Schema<ISettings>({
  sections: [sectionConfigSchema],
  navigation: [navigationItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

export const Settings = mongoose.model<ISettings>('Settings', settingsSchema);
