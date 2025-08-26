export interface Section {
  id: string;
  name: string;
  description: string;
  required: boolean;
  order: number;
  template: string; // Nombre del partial de Handlebars
  dataSchema: Record<string, any>; // Esquema de datos requeridos
  category: 'content' | 'commerce' | 'social' | 'contact';
  icon?: string; // Icono para la UI
}

export interface SectionConfiguration {
  id: string;
  enabled: boolean;
  order: number;
  data?: any;
}

export interface ClientConfiguration {
  clientId: string;
  name: string;
  description?: string;
  style: 'clasico' | 'moderno' | 'minimalista' | 'colorido';
  sections: SectionConfiguration[];
  company: {
    name: string;
    tagline: string;
    description: string;
    logo?: string;
    favicon?: string;
  };
  theme: {
    colors: {
      primary: string;
      primaryForeground: string;
      secondary: string;
      secondaryForeground: string;
      background: string;
      foreground: string;
      accent: string;
      accentForeground: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateConfiguration {
  id: string;
  name: string;
  description: string;
  style: 'clasico' | 'moderno' | 'minimalista' | 'colorido';
  sections: Section[];
  theme: {
    colors: Record<string, string>;
    fonts: Record<string, string>;
  };
}
