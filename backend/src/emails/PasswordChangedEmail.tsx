import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface PasswordChangedEmailProps {
  email: string;
}

export default function PasswordChangedEmail({
  email,
}: PasswordChangedEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Preview>Пароль вашего аккаунта изменён — FullToDo</Preview>
        <Body className='bg-[#f6f9fc] font-sans'>
          <Container className='bg-white mx-auto my-10 p-10 rounded-lg max-w-140'>
            <Heading className='text-2xl font-bold text-[#1a1a1a] mb-6'>
              FullToDo
            </Heading>

            <Section>
              <Text className='text-base text-[#444444] leading-6 mb-4'>
                Пароль аккаунта <span className='font-semibold'>{email}</span>{' '}
                был успешно изменён.
              </Text>
              <Text className='text-base text-[#444444] leading-6 mb-4'>
                Если это были вы — ничего делать не нужно.
              </Text>
            </Section>

            <Section className='bg-amber-50 border border-amber-200 rounded-md p-4 my-6'>
              <Text className='text-sm text-amber-800 m-0'>
                Если вы не меняли пароль — немедленно обратитесь в поддержку.
                Возможно, ваш аккаунт был скомпрометирован.
              </Text>
            </Section>

            <Section className='border-t border-[#eeeeee] mt-8 pt-4'>
              <Text className='text-xs text-[#aaaaaa]'>
                Это автоматическое уведомление от FullToDo.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
