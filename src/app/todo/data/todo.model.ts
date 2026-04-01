export interface TodoItem {
  id: string;
  name: string;
  description: string;
  closed: boolean;
  active: boolean;
}

export interface TodoCreateDto {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export interface TodoUpdateDto {
  name: string;
  description: string;
  closed: boolean;
  active: boolean;
}

