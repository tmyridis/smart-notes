export interface Notes {
  folder: string;
  id: number;
  items: SingleNote[];
}

export interface SingleNote {
  title: string;
  content: string;
  id: number;
  createdAt: string;
}
