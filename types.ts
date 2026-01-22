
export enum ProjectPhase {
  REQUIREMENTS = 'requirements',
  COMPONENTS = 'components',
  MODELING = 'modeling',
  PROGRAMMING = 'programming',
  REPORT = 'report'
}

export interface Component {
  id: string;
  name: string;
  category: 'sensor' | 'actuator' | 'controller' | 'power';
  description: string;
  specifications: Record<string, string>;
  cost: number;
  image: string;
}

export interface SystemRequirement {
  id: string;
  type: 'functional' | 'economic' | 'safety';
  description: string;
  status: 'pending' | 'defined';
}

export interface ProjectData {
  projectName: string;
  requirements: SystemRequirement[];
  selectedComponents: Component[];
  mathModel: string;
  arduinoCode: string;
  blockDiagramData: string;
}
