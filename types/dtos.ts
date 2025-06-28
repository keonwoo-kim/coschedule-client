export interface AccountDto {
  id: number;
  userId: string;
  userName: string;
  createdUtc: string;  // DateTime → ISO string
  updatedUtc: string;
}

export interface CommentDto {
  id: number;
  itemId: number;
  userId: number;
  userName: string;
  content: string;
  createdUtc: string;
  updatedUtc: string;
}

export interface ItemDto {
  id: number;
  source: string;
  externalId: string;
  title: string;
  url: string;
}

export interface RatingDto {
  id: number;
  itemId: number;
  userId: number;
  userName: string;
  value: number;
  createdUtc: string;
  updatedUtc: string;
}

export interface AccountDto {
  id: number;
  userId: string;
  userName: string;
  createdUtc: string;
  updatedUtc: string;
}

export interface LoginResponseModel {
  isSuccess: boolean;
  msg: string;
  userProfile: AccountDto;
  jwtToken?: string;
}

