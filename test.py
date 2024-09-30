import os
import sys
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI  # ChatOpenAI를 최신 모듈로 수정
from langchain.prompts import PromptTemplate

# .env 파일에서 환경 변수를 로드
load_dotenv()

# 환경 변수에서 OpenAI API 키 가져오기
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# OpenAI GPT 모델 설정 (ChatOpenAI 경로 변경)
llm = ChatOpenAI(temperature=0.7, openai_api_key=OPENAI_API_KEY, model="gpt-3.5-turbo")

# Prompt 설정
prompt = PromptTemplate(
    input_variables=["question"],
    template="You are a helpful assistant. Answer the following question: {question}"
)

# Prompt와 LLM을 연결 (| 연산자 사용)
chain = prompt | llm

# 질문 처리 함수
def ask_question(question):
    # 연산자의 invoke 메서드 사용
    response = chain.invoke({"question": question})
    # return response["text"]  # 결과에서 텍스트를 추출하여 반환
    return response.content  # 응답의 텍스트 부분 반환

# 명령줄 인자가 제대로 전달되었는지 확인
if len(sys.argv) > 1:
    question = sys.argv[1]
    response = ask_question(question)
    print(response)
else:
    print("Error: No question provided.")
