import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface VerificationEmailProps {
  verifyUrl: string;
}

export default function VerificationEmail({
  verifyUrl,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Preview>Подтвердите ваш email — FullToDo</Preview>
        <Body className='bg-[#f6f9fc] font-sans'>
          <Container className='bg-white mx-auto my-10 p-10 rounded-lg max-w-140'>
            <Heading className='text-2xl font-bold text-[#1a1a1a] mb-6'>
              FullToDo
            </Heading>

            <Section>
              <Text className='text-base text-[#444444] leading-6 mb-4'>
                Привет!
              </Text>
              <Text className='text-base text-[#444444] leading-6 mb-4'>
                Для завершения регистрации подтвердите ваш email, нажав на
                кнопку ниже. Ссылка действительна 24 часа.
              </Text>
            </Section>

            <Section className='text-center my-8'>
              <Button
                href={verifyUrl}
                className='bg-indigo-600 rounded-md text-white text-base font-semibold px-8 py-3 no-underline'
              >
                Подтвердить email
              </Button>
            </Section>

            <Section>
              <Text className='text-xs text-[#888888] mb-1'>
                Если кнопка не работает, перейдите по ссылке:
              </Text>
              <Text className='text-xs text-indigo-600 break-all'>
                {verifyUrl}
              </Text>
            </Section>

            <Section className='border-t border-[#eeeeee] mt-8 pt-4'>
              <Text className='text-xs text-[#aaaaaa]'>
                Если вы не регистрировались в FullToDo — просто проигнорируйте
                это письмо.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
