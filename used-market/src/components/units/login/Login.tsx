import { useForm } from 'react-hook-form';
import { ILoginFormData } from "./Login.types";
import * as S from "./Login.styles";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { gql, useMutation } from '@apollo/client';
import { Modal } from 'antd';
import { useRecoilState } from 'recoil';
import { accessTokenState } from '../../../commons/store';
import { IMutation, IMutationLoginUserArgs, IMutationLoginUserExampleArgs } from '../../../commons/types/generated/types';
import { useRouter } from 'next/router';

const schema = yup.object({
  email: yup
    .string()
    .email('이메일 형식에 적합하지 않습니다.')
    .required('이메일은 필수 입력 사항입니다.'),
  password: yup
    .string()
    .min(4, '비밀번호는 최소 4자리 이상 입력해주세요.')
    .max(15, '비밀번호는 최대 15자리까지 입력해주세요.')
    .required('비밀번호는 필수 입력 사항입니다.'),
});

const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password){
      accessToken
    }
  }
`;

export default function Login() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [loginUser] = useMutation<Pick<IMutation, 'loginUser'>, IMutationLoginUserArgs>(LOGIN_USER);
  const { register, handleSubmit, formState } = useForm<ILoginFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onClickSubmit = async (data: ILoginFormData) => {
    try {
      const result = await loginUser({
        variables: {
          email: data.email,
          password: data.password
        }
      });
      const accessToken = result.data?.loginUser.accessToken;
      console.log(accessToken);

      if (accessToken === undefined) {
        Modal.error({ content: '로그인에 실패하였습니다. 다시 시도해주세요.' });
        return;
      }
      setAccessToken(accessToken);
      void router.push('/');
    } catch(error) {
        if (error instanceof Error) Modal.error({ content: error.message });
    }
  }

  return (
    <S.Wrapper>
      <S.InputWrap>
        <S.LoginTitle>LOGIN</S.LoginTitle>
        <form onSubmit={handleSubmit(onClickSubmit)}>
          <S.LoignInputWrap>
            <S.LoginInput type="email" placeholder="이메일을 입력해주세요" {...register('email')} />
            <S.InputErrorMsg>{formState.errors.email?.message}</S.InputErrorMsg>
          </S.LoignInputWrap>
          <S.LoignInputWrap>
            <S.LoginInput type="password" placeholder="비밀번호를 입력해주세요" {...register('password')} />
            <S.InputErrorMsg>{formState.errors.password?.message}</S.InputErrorMsg>
          </S.LoignInputWrap>
          <S.LoginButton>로그인하기</S.LoginButton>
        </form>
      </S.InputWrap>
    </S.Wrapper>
  )
}