interface RegisterBody {
  fullName: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export { RegisterBody, LoginBody };
